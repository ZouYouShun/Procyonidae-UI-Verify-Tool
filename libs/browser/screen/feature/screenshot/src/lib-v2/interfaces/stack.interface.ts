import { ActionType } from './action.interface';

export interface IStack {
  type: ActionType;
  history: IHistory[];
  ready: boolean;
  draw: (
    ctx: CanvasRenderingContext2D,
    history: IHistory,
    stack?: IStack,
  ) => void;
  /**
   * actions/text.tsx
   */
  undoCB: (priority: any, action: any) => void;
  /**
   * actions/text.tsx
   */
  canDraw: boolean;
}

export interface IHistory {
  ready?: boolean;
  color: string;
  size: number;
  tiles?: ITile[];
  undoPriority?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  path?: Path2D;
  /**
   * Record dragging point trajectory for actions/brush.tsx
   */
  point?: Array<{ x: number; y: number }>;
  /**
   * Record e.target.innerText of RenderTextarea for actions/text.tsx
   */
  value?: string;
  /**
   * Record dom.getBoundingClientRect() of RenderTextarea for actions/text.tsx
   */
  domClientRect?: { x: number; y: number; width: number; height: number };
}

export interface ITile {
  x: number;
  y: number;
  color: string;
  size: number;
}
