import { app } from 'electron';
import path from 'path';

export type WindowOptions = {
  url: string;
  route: string;
};

export const getWindowRouteUrl = ({ url, route }: WindowOptions) => {
  const toRoute = `#${route}`;

  return app.isPackaged ? `${url}${toRoute}` : path.join(url, toRoute);
};

export const getAppPath = () => {
  const appPath = app.getAppPath();

  return app.isPackaged
    ? appPath.replace('app.asar', 'app.asar.unpacked')
    : appPath;
};
