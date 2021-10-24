import { RefObject, useRef, useState } from 'react';

import Tool, { strokeColors } from './enums/Tool';

function getMousePos(
  canvas: HTMLCanvasElement,
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
) {
  var rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

export const useCanvas = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [currTool, setCurrTool] = useState(Tool.Select);

  const [currStrokeColor, setCurrStrokeColor] = useState(strokeColors[0]);

  const isMouseDownRef = useRef(false);

  const getContext = () => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    return context;
  };

  return {
    currTool,
    setCurrTool,
    currStrokeColor,
    setCurrStrokeColor: (color: string) => {
      const context = getContext();
      setCurrStrokeColor(color);
      context.strokeStyle = color;
    },
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      isMouseDownRef.current = true;
      const context = getContext();
      const mousePos = getMousePos(canvasRef.current!, e);

      context.beginPath();
      context.strokeStyle = currStrokeColor;
      context.moveTo(mousePos.x, mousePos.y);
    },
    onMouseUp: () => {
      isMouseDownRef.current = false;
      const context = getContext();
      context.closePath();
    },
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (currTool === Tool.Stroke && isMouseDownRef.current) {
        const context = getContext();

        const mousePos = getMousePos(canvasRef.current!, e);

        context.lineTo(mousePos.x, mousePos.y);
        context.stroke();
      }
    },
  };
};
