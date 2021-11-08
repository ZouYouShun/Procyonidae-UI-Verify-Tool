import React from 'react';

interface SizeProps {
  value: number;
  isFont?: boolean;
  onChange: (value: number) => void;
}

export default ({ value, isFont, onChange }: SizeProps) => {
  const border = [3, 6, 9];
  const font = [14, 17, 20, 23, 26, 29, 32, 64, 96, 128];
  return (
    <div className="screenshot-size">
      {!isFont ? (
        border.map((t) => {
          const classNames = ['screenshot-size-item'];
          if (t === value) {
            classNames.push('screenshot-size-active');
          }
          return (
            <div
              key={t}
              className={classNames.join(' ')}
              onClick={() => onChange && onChange(t)}
            >
              <div
                className="screenshot-size-pointer"
                style={{
                  width: t * 1.8,
                  height: t * 1.8,
                }}
              />
            </div>
          );
        })
      ) : (
        <div className="screenshot-size-font">
          <select
            value={value}
            onChange={(e) => onChange && onChange(+e.target.value)}
          >
            {font.map((t, i) => (
              <option value={t} key={i}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
