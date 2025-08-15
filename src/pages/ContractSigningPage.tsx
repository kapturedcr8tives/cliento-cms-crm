import { useParams } from 'react-router-dom';
import { useContract, useUpdateContract } from '../features/contracts/useContracts';
import { RichTextEditor } from '../components/editor/RichTextEditor';
import { SignaturePad } from '../components/ui/SignaturePad';
import { useEffect, useState } from 'react';

// This is a simplified layout for a public-facing page
function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    )
}

export function ContractSigningPage() {
  const { contractId } = useParams();
  // We need a way to fetch a single contract without being authenticated.
  // For now, we'll reuse the existing hook, but in a real app, this would
  // use a different RLS policy or a dedicated public API endpoint.
  const { data: contract, isLoading, error } = useContract();
  const { mutate: updateContract, isPending: isUpdating } = useUpdateContract();

  const [isSigned, setIsSigned] = useState(false);

  const handleSaveSignature = (signature: string) => {
    if (!contractId) return;
    // In a real app, you might store the signature image itself.
    // For now, we just update the status and signed_at timestamp.
    updateContract({ id: contractId, status: 'signed', signed_at: new Date().toISOString() }, {
        onSuccess: () => {
            setIsSigned(true);
        }
    });
  };

  if (isLoading) return <PublicLayout><p>Loading contract...</p></PublicLayout>;
  if (error) return <PublicLayout><p className="text-red-500">Error: {error.message}</p></PublicLayout>;
  if (!contract) return <PublicLayout><p>Contract not found.</p></PublicLayout>;

  if (isSigned || contract.status === 'signed') {
    return (
        <PublicLayout>
            <h1 className="text-3xl font-bold text-green-600">Contract Signed</h1>
            <p className="mt-4">Thank you! This contract was signed on {new Date(contract.signed_at || Date.now()).toLocaleDateString()}.</p>
        </PublicLayout>
    )
  }

  return (
    <PublicLayout>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{contract.name}</h1>
            <p className="text-lg text-gray-600 mt-1">For: {contract.clients?.name || 'N/A'}</p>
        </div>

        <div className="prose max-w-none border p-4 rounded-lg">
            {/* Here we would render the Tiptap JSON as HTML, not the editor.
                A proper renderer would be needed. For simulation, we can use the editor in read-only mode.
            */}
             <RichTextEditor content={contract.content} onChange={() => {}} />
        </div>

        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Digital Signature</h2>
            <p className="mb-4">Please sign below to accept the terms of this contract.</p>
            <SignaturePad onSave={handleSaveSignature} />
        </div>
    </PublicLayout>
  );
}
