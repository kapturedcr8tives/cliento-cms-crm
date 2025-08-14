import { z } from 'zod';
import { supabase } from './supabase';
import { signupSchema, loginSchema } from '../components/auth/validation';

// Type definitions for the form data
type SignupData = z.infer<typeof signupSchema>;
type LoginData = z.infer<typeof loginSchema>;

/**
 * Handles user sign-up.
 * This function would ideally be a single transaction or a call to a Supabase Edge Function
 * to ensure atomicity (either all operations succeed, or none do).
 * For now, we simulate the sequence of operations.
 */
export async function signUp({ organizationName, fullName, email, password }: SignupData) {
  // 1. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('Sign up failed: no user returned.');

  const user = authData.user;

  // 2. Create the organization
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert([{ name: organizationName }])
    .select()
    .single();

  if (orgError) {
    // If org creation fails, we should ideally delete the created auth user
    await supabase.auth.admin.deleteUser(user.id);
    throw new Error(`Could not create organization: ${orgError.message}`);
  }

  // 3. Create the user's profile and link it to the organization
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      { id: user.id, full_name: fullName, organization_id: orgData.id },
    ]);

  if (profileError) {
    // If profile creation fails, clean up the user and organization
    await supabase.auth.admin.deleteUser(user.id);
    await supabase.from('organizations').delete().match({ id: orgData.id });
    throw new Error(`Could not create user profile: ${profileError.message}`);
  }

  // 4. Assign the ORG_ADMIN role to the new user for their organization
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert([
      { user_id: user.id, organization_id: orgData.id, role: 'ORG_ADMIN' }
    ]);

  if (roleError) {
    // If role assignment fails, clean up everything
    await supabase.auth.admin.deleteUser(user.id);
    // The profile and org will be deleted via cascade, if set up correctly.
    // Or delete manually to be safe.
    await supabase.from('organizations').delete().match({ id: orgData.id });
    throw new Error(`Could not assign role: ${roleError.message}`);
  }

  return authData;
}

/**
 * Handles user sign-in.
 */
export async function signIn({ email, password }: LoginData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

/**
 * Handles user sign-out.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
