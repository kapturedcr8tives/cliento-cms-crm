import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContract, useUpdateContract } from '../features/contracts/useContracts';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { Button } from '../components/ui/Button';

export function ContractEditorPage() {
  const { contractId } = useParams();
  const { data: contract, isLoading, error } = useContract();
  const { mutate: updateContract, isPending: isUpdating } = useUpdateContract();

  // Local state to manage the editor's content
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // When the contract data loads, set the editor content
    if (contract?.content) {
      setContent(contract.content);
    }
  }, [contract]);

  const handleSave = () => {
    if (!contractId) return;
    updateContract({ id: contractId, content });
  };

  if (isLoading) return <p>Loading contract...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!contract) return <p>Contract not found.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{contract.name}</h1>
            <p className="text-lg text-gray-600 mt-1">Client: {contract.clients?.name || 'N/A'}</p>
        </div>
        <div className="flex items-center space-x-4">
            <Button
                type="button"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => {
                    const url = `${window.location.origin}/sign/${contractId}`;
                    navigator.clipboard.writeText(url);
                    alert(`Signing link copied to clipboard:\n${url}`);
                }}
            >
                Get Sharable Link
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Contract'}
            </Button>
        </div>
      </div>

      {content !== null && (
        <RichTextEditor content={content} onChange={setContent} />
      )}
    </div>
  );
}
