import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileUp } from 'lucide-react';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const pdfFiles = (Array.from(e.dataTransfer.files) as File[]).filter(
        (file) => file.type === 'application/pdf'
      );
      if (pdfFiles.length > 0) {
        onFilesAdded(pdfFiles);
      } else {
        alert("Veuillez déposer uniquement des fichiers PDF.");
      }
    }
  }, [onFilesAdded, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pdfFiles = (Array.from(e.target.files) as File[]).filter(
        (file) => file.type === 'application/pdf'
      );
      onFilesAdded(pdfFiles);
    }
    // Reset value so same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`
        relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out p-10
        flex flex-col items-center justify-center text-center overflow-hidden
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' 
          : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        multiple
        accept="application/pdf"
        disabled={disabled}
      />
      
      <div className={`p-4 rounded-full bg-indigo-100 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
        {isDragging ? (
           <FileUp className="w-8 h-8 text-indigo-600" />
        ) : (
           <Upload className="w-8 h-8 text-indigo-600" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {isDragging ? "Déposez les fichiers ici" : "Cliquez ou déposez vos PDF ici"}
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        Sélectionnez plusieurs fichiers pour les fusionner. Traitement 100% local et sécurisé.
      </p>
    </div>
  );
};

export default Dropzone;