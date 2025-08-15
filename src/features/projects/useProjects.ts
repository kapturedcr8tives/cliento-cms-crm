import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  createTask,
  updateTask,
  updateTaskStageAndPosition,
  deleteTask,
  createProjectStage
} from '../../services/apiProjects';
import { useParams } from 'react-router-dom';

// --- Project Hooks ---
export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: getProjects });
}

export function useProject() {
  const { projectId } = useParams();
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      alert('Project created');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err) => alert(err.message),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      alert('Project updated');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
    onError: (err) => alert(err.message),
  });
}

// --- Task Hooks ---
export function useCreateTask() {
    const queryClient = useQueryClient();
    const { projectId } = useParams();
    return useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            alert('Task created');
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        },
        onError: (err) => alert(err.message),
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    const { projectId } = useParams();
    return useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            alert('Task updated');
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        },
        onError: (err) => alert(err.message),
    });
}

export function useUpdateTaskStage() {
    const queryClient = useQueryClient();
    const { projectId } = useParams();
    return useMutation({
        mutationFn: updateTaskStageAndPosition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        },
        onError: (err) => alert(err.message),
    });
}

// --- Project Stage Hooks ---
export function useCreateProjectStage() {
    const queryClient = useQueryClient();
    const { projectId } = useParams();
    return useMutation({
        mutationFn: createProjectStage,
        onSuccess: () => {
            alert('Stage created');
            queryClient.invalidateQueries({ queryKey: ['project', projectId] });
        },
        onError: (err) => alert(err.message),
    });
}
