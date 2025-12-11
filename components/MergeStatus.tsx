import React from 'react';
import { Download, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { MergeResult, MergeStatus as Status } from '../types';
import { formatFileSize } from '../utils/pdfService';

interface MergeStatusProps {
  status: Status;
  result: MergeResult | null;
  onReset: () => void;
}

const MergeStatus: React.FC<MergeStatusProps> = ({ status, result, onReset }) => {
  if (status === Status.IDLE) return null;

  return (
    <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center animate-fade-in">
      
      {status === Status.PROCESSING && (
        <div className="py-8 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">Fusion en cours...</h3>
          <p className="text-slate-500">Nous assemblons vos pages.</p>
        </div>
      )}

      {status === Status.SUCCESS && result && (
        <div className="py-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Fusion réussie !</h3>
          <p className="text-slate-600 mb-6">
            Votre fichier <span className="font-semibold">{result.fileName}</span> ({formatFileSize(result.size)}) est prêt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={result.url}
              download={result.fileName}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger le PDF
            </a>
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Fusionner d'autres fichiers
            </button>
          </div>
        </div>
      )}

      {status === Status.ERROR && (
        <div className="py-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl font-bold">!</span>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Une erreur est survenue</h3>
          <p className="text-slate-500 mb-4">Impossible de fusionner les fichiers. Veuillez vérifier qu'ils ne sont pas corrompus ou protégés par mot de passe.</p>
          <button
            onClick={onReset}
            className="text-indigo-600 font-medium hover:text-indigo-800 underline"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default MergeStatus;