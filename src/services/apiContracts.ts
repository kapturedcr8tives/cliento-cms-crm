import { supabase } from './supabase';

export async function getContracts() {
  const { data, error } = await supabase
    .from('contracts')
    .select('*, clients(name), projects(name)')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Contracts could not be loaded');
  return data;
}

export async function getContract(id: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select('*, clients(name), projects(name)')
    .eq('id', id)
    .single();
  if (error) throw new Error('Contract could not be loaded');
  return data;
}

export async function createContract(newContract: any) {
  const { data, error } = await supabase.from('contracts').insert([newContract]).select().single();
  if (error) throw new Error('Contract could not be created');
  return data;
}

export async function updateContract({ id, ...updatedFields }: { id: string, [key: string]: any }) {
  const { data, error } = await supabase.from('contracts').update(updatedFields).eq('id', id).select().single();
  if (error) throw new Error('Contract could not be updated');
  return data;
}

export async function deleteContract(id: string) {
  const { error } = await supabase.from('contracts').delete().eq('id', id);
  if (error) throw new Error('Contract could not be deleted');
  return null;
}
