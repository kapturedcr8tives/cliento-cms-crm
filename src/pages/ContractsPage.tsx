import { useState } from 'react';
import { useContracts } from '../features/contracts/useContracts';
import { DataTable } from '../components/datatable/DataTable';
import { columns } from '../features/contracts/columns';
import { Button } from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export function ContractsPage() {
  const { isLoading, data: contracts, error } = useContracts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, the "Add" button would likely navigate
  // to a full-page editor, but a modal is fine for a start.
  const handleAddNew = () => {
    // For now, just open a placeholder modal
    // In the next steps, this would likely navigate to /contracts/new
    // or open a form modal.
    setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contracts</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Contract
        </Button>
      </div>

      {isLoading && <p>Loading contracts...</p>}
      {error && <p className="text-red-500">Error loading contracts: {error.message}</p>}

      {!isLoading && !error && contracts && (
        <DataTable columns={columns} data={contracts} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Create New Contract'}
      >
        <p>Contract creation form will be here in a later step.</p>
      </Modal>
    </div>
  );
}
