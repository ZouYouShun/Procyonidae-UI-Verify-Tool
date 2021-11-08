import React from 'react';

import Color from './screenshot-color.component';
import Size from './screenshot-size.component';

interface SizeColorProps {
  size: number;
  color: string;
  isFont?: boolean;
  onSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
}

export default ({
  size,
  color,
  isFont,
  onSizeChange,
  onColorChange,
}: SizeColorProps) => {
  return (
    <div className="screenshot-sizecolor">
      <Size isFont={isFont} value={size} onChange={onSizeChange} />
      <Color value={color} onChange={onColorChange} />
    </div>
  );
};
