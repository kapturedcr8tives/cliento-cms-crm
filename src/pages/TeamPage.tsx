import { useState } from 'react';
import { DataTable } from '../components/datatable/DataTable';
import { columns } from '../features/team/columns';
import { Button } from '../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { InviteUserForm } from '../features/team/InviteUserForm';
import { TeamMember } from '../features/team/validation';

// Mock data until the API layer is built
const mockTeamMembers: TeamMember[] = [
    { id: '1', email: 'jules@example.com', full_name: 'Jules Verne', role: 'ORG_ADMIN' },
    { id: '2', email: 'jane.doe@example.com', full_name: 'Jane Doe', role: 'TEAM_MEMBER' },
    { id: '3', email: 'client.user@example.com', full_name: 'Client User', role: 'CLIENT' },
    { id: '4', email: 'pending.invite@example.com', full_name: null, role: 'TEAM_MEMBER' },
];

export function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a later step, this would be:
  // const { isLoading, data: teamMembers, error } = useTeamMembers();
  const isLoading = false;
  const error = null;
  const teamMembers = mockTeamMembers;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="w-5 h-5 mr-2" />
          Invite User
        </Button>
      </div>

      {isLoading && <p>Loading team members...</p>}
      {error && <p className="text-red-500">Error loading team members.</p>}

      {!isLoading && !error && teamMembers && (
        <DataTable columns={columns} data={teamMembers} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Invite New User'}
      >
        <InviteUserForm onCloseModal={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
