import { ScreenshotContextType } from '../screenshot.context';
import { IHistory } from './stack.interface';
import { Viewer } from './viewer.interface';

export type ActionType =
  | 'arrow'
  | 'brush'
  | 'ellipse'
  | 'mosaic'
  | 'rect'
  | 'text';

export interface IAction {
  beforeUnMount: () => void;
  mousedown: (e: MouseEvent, actionProps: IActionProps) => void;
  mousemove: (
    e: MouseEvent,
    actionProps: IActionProps,
    handlePointInRecord: (e: React.MouseEvent | MouseEvent) => {
      action?: IHistory;
      index: number;
      type: ActionType;
    },
  ) => void;
  mouseup: (e: MouseEvent, actionProps: IActionProps) => void;
  render?: () => JSX.Element;
}

export type EmitDataMapByType = {
  onSave: {
    dataURL: string;
    viewer: Viewer;
  };
  onOk: {
    dataURL: string;
    viewer: Viewer;
  };
  onCancel: null;
};

export interface IActionProps {
  viewer: HTMLDivElement;
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  context: Omit<ScreenshotContextType, 'setContext'>;
  setContext: NonNullable<ScreenshotContextType['setContext']>;
  emit: <
    EmitType extends keyof EmitDataMapByType,
    EmitData extends EmitDataMapByType[EmitType],
  >(
    type: EmitType,
    data: EmitData,
  ) => void;
}

export interface IActionItem {
  key?: IAction;
  value?: Record<string, any>;
  type?: 'divider';
}
