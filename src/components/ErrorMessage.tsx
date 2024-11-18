import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {message}
      </div>
    </div>
  );
}