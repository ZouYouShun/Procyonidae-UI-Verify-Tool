import React from 'react';

const colors = [
  '#ee5126',
  '#fceb4d',
  '#90e746',
  '#51c0fa',
  '#7a7a7a',
  '#ffffff',
] as const;

interface ColorProps {
  value: string;
  onChange: (value: typeof colors[number]) => void;
}

export default ({ value, onChange }: ColorProps) => {
  return (
    <div className="screenshot-color">
      {colors.map((color) => {
        const classNames = ['screenshot-color-item'];
        if (color === value) {
          classNames.push('screenshot-color-active');
        }
        return (
          <div
            key={color}
            className={classNames.join(' ')}
            style={{ backgroundColor: color }}
            onClick={() => onChange && onChange(color)}
          >
            <div className="screenshot-color-hook">
              <div className="screenshot-color-hook-symbol" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
