import { supabase } from './supabase';

// --- Lead Stages API ---

export async function getLeadStages() {
  const { data, error } = await supabase
    .from('lead_stages')
    .select('*')
    .order('position');

  if (error) {
    console.error(error);
    throw new Error('Lead stages could not be loaded');
  }
  return data;
}

// --- Leads API ---

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      lead_stages ( name ),
      profiles ( full_name, avatar_url )
    `)
    .order('position');

  if (error) {
    console.error(error);
    throw new Error('Leads could not be loaded');
  }
  return data;
}

export async function createLead(newLead: Omit<any, 'id' | 'created_at' | 'updated_at' | 'organization_id'>) {
  const { data, error } = await supabase
    .from('leads')
    .insert([newLead])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Lead could not be created');
  }
  return data;
}

export async function updateLead({ id, ...updatedFields }: { id: string, [key: string]: any }) {
  const { data, error } = await supabase
    .from('leads')
    .update({ ...updatedFields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Lead could not be updated');
  }
  return data;
}

// This is a more specific update for drag-and-drop, changing only stage and position
export async function updateLeadStageAndPosition({ leadId, stageId, position }: { leadId: string, stageId: string, position: number }) {
    const { data, error } = await supabase
    .from('leads')
    .update({ stage_id: stageId, position: position, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Lead stage could not be updated');
  }
  return data;
}


export async function deleteLead(id: string) {
  const { error } = await supabase.from('leads').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Lead could not be deleted');
  }
  return null;
}
