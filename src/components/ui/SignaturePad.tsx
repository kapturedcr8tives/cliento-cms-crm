import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './Button';

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    const signatureData = sigCanvas.current?.toDataURL('image/png') || '';
    onSave(signatureData);
  };

  return (
    <div>
      <div className="border border-gray-300 rounded-lg">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ className: 'w-full h-48' }}
        />
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <Button type="button" onClick={clear} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          Clear
        </Button>
        <Button type="button" onClick={save}>
          Accept & Sign
        </Button>
      </div>
    </div>
  );
}
