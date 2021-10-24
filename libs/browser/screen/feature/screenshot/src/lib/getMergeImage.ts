import { ImageSource } from '@procyonidae/api-interfaces';
import cloneDeep from 'lodash/cloneDeep';
import max from 'lodash/max';
import min from 'lodash/min';
import orderBy from 'lodash/orderBy';
import mergeImages from 'merge-images';

export const getMergeImage = (originalSources: ImageSource[]) => {
  if (!Array.isArray(originalSources)) {
    return;
  }

  const sources = cloneDeep(originalSources);

  const min_x = min(sources.map((o) => o.x)) || 0;
  orderBy(sources, ['x'], ['asc']).forEach((o, i) => {
    o.x = i === 0 ? 0 : o.x - min_x;
  });

  const min_y = min(sources.map((o) => o.y)) || 0;
  orderBy(sources, ['y'], ['asc']).forEach((o, i) => {
    o.y = i === 0 ? 0 : Math.abs(o.y - min_y);
  });

  return mergeImages(sources, {
    width: max(sources.map(({ x, width }) => x + width)),
    height: max(sources.map(({ y, height }) => y + height)),
  });
};
