import { useState } from 'react';
import { useClients } from '../features/clients/useClients';
import { DataTable } from '../components/datatable/DataTable';
import { getColumns, Client } from '../features/clients/columns';
import { Button } from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ClientForm } from '../features/clients/ClientForm';

export function ClientsPage() {
  const { isLoading, clients, error } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>(undefined);

  const handleOpenModal = () => {
    setClientToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClientToEdit(undefined);
  };

  const columns = getColumns(handleEdit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <Button onClick={handleOpenModal}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Client
        </Button>
      </div>

      {isLoading && <p>Loading clients...</p>}
      {error && <p className="text-red-500">Error loading clients: {error.message}</p>}

      {!isLoading && !error && clients && (
        <DataTable columns={columns} data={clients} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={clientToEdit ? 'Edit Client' : 'Create New Client'}
      >
        <ClientForm
          clientToEdit={clientToEdit}
          onCloseModal={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
