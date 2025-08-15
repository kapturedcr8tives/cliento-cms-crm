import { supabase } from './supabase';

// --- Projects API ---

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Projects could not be loaded');
  return data;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(name), project_stages(*, tasks(*, profiles(full_name)))')
    .eq('id', id)
    .single();
  if (error) throw new Error('Project could not be loaded');
  return data;
}

export async function createProject(newProject: any) {
  const { data, error } = await supabase.from('projects').insert([newProject]).select().single();
  if (error) throw new Error('Project could not be created');
  return data;
}

export async function updateProject({ id, ...updatedFields }: { id: string, [key: string]: any }) {
  const { data, error } = await supabase.from('projects').update(updatedFields).eq('id', id).select().single();
  if (error) throw new Error('Project could not be updated');
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error('Project could not be deleted');
  return null;
}

// --- Tasks API ---

export async function createTask(newTask: any) {
    const { data, error } = await supabase.from('tasks').insert([newTask]).select().single();
    if (error) throw new Error('Task could not be created');
    return data;
  }

export async function updateTask({ id, ...updatedFields }: { id: string, [key: string]: any }) {
    const { data, error } = await supabase.from('tasks').update(updatedFields).eq('id', id).select().single();
    if (error) throw new Error('Task could not be updated');
    return data;
}

export async function updateTaskStageAndPosition({ taskId, stageId, position }: { taskId: string, stageId: string, position: number }) {
    const { data, error } = await supabase.from('tasks').update({ stage_id: stageId, position }).eq('id', taskId).select().single();
    if (error) throw new Error('Task could not be moved');
    return data;
}

export async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw new Error('Task could not be deleted');
    return null;
}

// --- Project Stages API ---
// Typically stages might be created automatically with a project via a template,
// but providing the API for manual creation is also useful.
export async function createProjectStage(newStage: any) {
    const { data, error } = await supabase.from('project_stages').insert([newStage]).select().single();
    if (error) throw new Error('Project stage could not be created');
    return data;
}
