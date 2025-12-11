export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export enum MergeStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface MergeResult {
  url: string;
  fileName: string;
  size: number;
}