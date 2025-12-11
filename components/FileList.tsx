import React, { useRef, useState } from 'react';
import { PdfFile } from '../types';
import { formatFileSize } from '../utils/pdfService';
import { Trash2, ArrowUp, ArrowDown, FileText, GripVertical, ArrowDownAZ } from 'lucide-react';

interface FileListProps {
  files: PdfFile[];
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSort: () => void;
  disabled?: boolean;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onReorder,
  onSort,
  disabled 
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Ref pour empêcher les mises à jour trop fréquentes pendant le drag
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  if (files.length === 0) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    dragItem.current = index;
    // Set drag effect
    e.dataTransfer.effectAllowed = "move";
    // Important for Firefox
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled) return;
    dragOverItem.current = index;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (dragItem.current !== null && dragOverItem.current !== null) {
      onReorder(dragItem.current, dragOverItem.current);
    }
    
    setDraggedIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center justify-between text-sm font-medium text-slate-500 px-2 mb-2">
        <span>Fichiers ({files.length})</span>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSort}
            disabled={disabled || files.length < 2}
            className="flex items-center text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Trier par nom (A-Z)"
          >
            <ArrowDownAZ className="w-3 h-3 mr-1" />
            Trier A-Z
          </button>
          <span>Ordre de fusion</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div 
            key={file.id} 
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`
              relative flex items-center justify-between bg-white p-3 rounded-lg border transition-all
              ${draggedIndex === index ? 'opacity-40 border-dashed border-indigo-400' : 'border-slate-200 shadow-sm hover:shadow-md'}
              ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
            `}
          >
            <div className="flex items-center flex-1 min-w-0 mr-4">
              {/* Grip Handle & Number */}
              <div className="flex items-center mr-3 text-slate-400">
                <div 
                  className={`mr-2 ${disabled ? 'opacity-30' : 'cursor-grab hover:text-indigo-500'}`}
                  title="Glisser pour déplacer"
                >
                  <GripVertical className="w-5 h-5" />
                </div>
                <span className="font-mono text-sm font-bold w-5 text-slate-400 select-none">
                  {index + 1}.
                </span>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mr-3 select-none">
                <FileText className="w-5 h-5" />
              </div>

              {/* File Info */}
              <div className="truncate">
                <p className="font-medium text-slate-800 truncate select-none" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 select-none">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onMoveUp(index)}
                disabled={disabled || index === 0}
                className="hidden sm:block p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                title="Monter"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onMoveDown(index)}
                disabled={disabled || index === files.length - 1}
                className="hidden sm:block p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                title="Descendre"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2"></div>
              <button
                onClick={() => onRemove(file.id)}
                disabled={disabled}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;