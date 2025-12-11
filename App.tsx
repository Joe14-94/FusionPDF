import React, { useState, useCallback } from 'react';
import { Layers, FileStack } from 'lucide-react';
import Dropzone from './components/Dropzone';
import FileList from './components/FileList';
import MergeStatus from './components/MergeStatus';
import { PdfFile, MergeStatus as Status, MergeResult } from './types';
import { mergePdfs } from './utils/pdfService';

function App() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [result, setResult] = useState<MergeResult | null>(null);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    // Generate unique IDs and add to state
    const pdfFiles: PdfFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size
    }));
    
    setFiles(prev => [...prev, ...pdfFiles]);
    // Reset status if user adds more files after an error or success
    if (status !== Status.PROCESSING) {
        setStatus(Status.IDLE);
        setResult(null);
    }
  }, [status]);

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      return newFiles;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
      return newFiles;
    });
  };

  // Nouvelle fonction pour le Drag & Drop
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setFiles(prev => {
      const newFiles = [...prev];
      const [movedItem] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedItem);
      return newFiles;
    });
  };

  // Nouvelle fonction pour le tri automatique
  const handleSortByName = () => {
    setFiles(prev => {
      return [...prev].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    setStatus(Status.PROCESSING);
    
    // Small delay to allow UI to update to loading state
    setTimeout(async () => {
      try {
        const mergedBlob = await mergePdfs(files);
        const url = URL.createObjectURL(mergedBlob);
        
        setResult({
          url,
          fileName: `merged_document_${new Date().toISOString().slice(0, 10)}.pdf`,
          size: mergedBlob.size
        });
        setStatus(Status.SUCCESS);
      } catch (error) {
        setStatus(Status.ERROR);
      }
    }, 500);
  };

  const handleReset = () => {
    setFiles([]);
    setStatus(Status.IDLE);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl shadow-lg mb-4">
            <Layers className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Fusion PDF Pro
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Combinez vos documents PDF en un seul fichier. 
            <br className="hidden sm:block" />
            Simple, gratuit et 100% privé (tout se passe sur votre appareil).
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
          
          {status === Status.SUCCESS ? (
             <MergeStatus status={status} result={result} onReset={handleReset} />
          ) : (
            <>
              <Dropzone 
                onFilesAdded={handleFilesAdded} 
                disabled={status === Status.PROCESSING} 
              />
              
              <FileList 
                files={files} 
                onRemove={handleRemoveFile}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onReorder={handleReorder}
                onSort={handleSortByName}
                disabled={status === Status.PROCESSING}
              />

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                  {files.length === 0 
                    ? "Aucun fichier sélectionné" 
                    : `${files.length} fichier${files.length > 1 ? 's' : ''} prêt${files.length > 1 ? 's' : ''} à fusionner`
                  }
                </div>
                
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || status === Status.PROCESSING}
                  className={`
                    w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white transition-all
                    ${files.length < 2 || status === Status.PROCESSING
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  {status === Status.PROCESSING ? (
                     "Traitement..."
                  ) : (
                    <>
                      <FileStack className="w-5 h-5 mr-2" />
                      Fusionner les PDF
                    </>
                  )}
                </button>
              </div>

              {files.length === 1 && (
                <p className="text-center text-sm text-amber-600 mt-4 bg-amber-50 py-2 rounded-lg">
                  Ajoutez au moins un autre fichier pour lancer la fusion.
                </p>
              )}
              
              {status === Status.ERROR && <MergeStatus status={status} result={null} onReset={() => setStatus(Status.IDLE)} />}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} PDF Fusion Pro. Fait avec React & pdf-lib.</p>
        </div>
      </div>
    </div>
  );
}

export default App;