import React from 'react';

interface ScreenshotContextType {
  image?: { el?: CanvasImageSource; width: number; height: number };
  viewer?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    resizing?: boolean;
    moving?: boolean;
  };
  width?: number;
  height?: number;
  action?: {
    beforeUnMount: () => void;
    mousedown: (e: MouseEvent, arg: any) => void;
    mousemove: (e: MouseEvent, ...args: any[]) => void;
    mouseup: (e: MouseEvent, arg: any) => void;
    render?: () => JSX.Element;
  };
  actions?: Array<{
    key?: any;
    value?: Record<string, any>;
    type?: 'divider';
  }>;
  stack?: Array<{
    draw: (...args: any[]) => void;
    history: any[];
    type: string;
  }>;
  state?: Record<string, any>;
  border?: number;
  font?: number;
  color?: string;
  cursor?: string;
  magnifyPoint?: { x: number; y: number; right: number; bottom: number };
  editPointers?: Array<{
    name: string;
    color: string;
    x: number;
    y: number;
    size: number;
  }>;
  setContext?: (
    context:
      | ScreenshotContextType
      | ((...args: any[]) => ScreenshotContextType),
    callback?: () => void,
  ) => void;
}

const ScreenshotContext = React.createContext<ScreenshotContextType>({
  image: undefined,
  viewer: undefined,
  action: undefined,
  width: 0,
  height: 0,
  stack: [],
  cursor: undefined,
});

export { ScreenshotContext as default, ScreenshotContextType };
