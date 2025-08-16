import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export async function getTeamMembers() {
  // This would need to be more sophisticated, fetching profiles based on the current user's org
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) throw new Error('User not found');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.user.id)
    .single();

  if (profileError || !profile) throw new Error('Profile not found');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, user_roles(role)')
    .eq('organization_id', profile.organization_id);

  if (error) throw new Error('Team members could not be loaded');

  // The data structure needs to be flattened here to match the UI expectations
  return data.map(member => ({
      ...member,
      role: member.user_roles[0]?.role || 'Unknown'
  }));
}

export async function inviteUser({ email, role }: { email: string, role: string }) {
  // In a real app, this entire operation should be a single database function (RPC)
  // or an Edge Function for security and atomicity.

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) throw new Error('User not found');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.user.id)
    .single();

  if (profileError || !profile) throw new Error('Profile not found');

  const token = uuidv4();
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  const { data, error } = await supabase
    .from('invitations')
    .insert([{
        organization_id: profile.organization_id,
        email,
        role,
        token,
        expires_at
    }]);

  if (error) throw new Error('Could not create invitation.');

  // Here, you would trigger an email to the user with a link:
  // e.g., `https://your-app.com/accept-invite?token=${token}`
  console.log(`Invitation created for ${email}. Token: ${token}`);

  return data;
}

// A public function to get invitation details. In a real app, this would be
// an RPC call to a `security_invoker` function in Supabase to avoid exposing RLS.
export async function getInvitationDetails(token: string) {
    const { data, error } = await supabase
        .from('invitations')
        .select('*, organizations(name)')
        .eq('token', token)
        .single();

    if (error) throw new Error('Invitation not found or has expired.');
    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
        throw new Error('This invitation has expired.');
    }
    return data;
}

export async function acceptInvite({ token, fullName, password }: any) {
    // This entire flow MUST be a single transaction or an RPC call in a real app.
    // 1. Get invitation details
    const invitation = await getInvitationDetails(token);

    // 2. Sign up the new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: password,
        options: { data: { full_name: fullName } }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Could not create user.');

    // 3. Create their profile, linking to the organization
    const { error: profileError } = await supabase.from('profiles').insert([
        { id: authData.user.id, full_name: fullName, organization_id: invitation.organization_id }
    ]);
    if (profileError) throw new Error('Could not create profile.');

    // 4. Assign their role
    const { error: roleError } = await supabase.from('user_roles').insert([
        { user_id: authData.user.id, organization_id: invitation.organization_id, role: invitation.role }
    ]);
    if (roleError) throw new Error('Could not assign role.');

    // 5. Delete the invitation
    await supabase.from('invitations').delete().eq('id', invitation.id);

    return authData;
}


// Other functions like removeMember, updateMemberRole would go here.
