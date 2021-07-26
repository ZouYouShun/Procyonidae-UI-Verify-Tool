export interface CaptureData {
  dataURL: string;
}

export type OkData = CaptureData;

export interface Display extends Electron.Rectangle {
  id: number;
}

export interface BoundAndDisplay {
  bound: Electron.Rectangle;
  display: Display;
}

