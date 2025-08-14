import { supabase } from './supabase';

export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    throw new Error('Clients could not be loaded');
  }

  return data;
}

// The 'newClient' object type would be defined based on the form values.
// For now, we assume it matches the table structure, minus the id and created_at.
export async function createClient(newClient: Omit<any, 'id' | 'created_at' | 'organization_id'>) {
  const { data, error } = await supabase
    .from('clients')
    .insert([newClient])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Client could not be created');
  }

  return data;
}

export async function updateClient({ id, ...updatedFields }: { id: string, [key: string]: any }) {
  const { data, error } = await supabase
    .from('clients')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Client could not be updated');
  }

  return data;
}

export async function deleteClient(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Client could not be deleted');
  }

  return data;
}
