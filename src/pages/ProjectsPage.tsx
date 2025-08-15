import { useState } from 'react';
import { useProjects } from '../features/projects/useProjects';
import { DataTable } from '../components/datatable/DataTable';
import { columns } from '../features/projects/columns';
import { Button } from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ProjectForm } from '../features/projects/ProjectForm';

export function ProjectsPage() {
  const { isLoading, data: projects, error } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Project
        </Button>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">Error loading projects: {error.message}</p>}

      {!isLoading && !error && projects && (
        <DataTable columns={columns} data={projects} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Create New Project'}
      >
        <ProjectForm onCloseModal={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
