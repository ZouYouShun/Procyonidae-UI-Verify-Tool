import { app } from 'electron';

export type WindowOptions = {
  url: string;
  route: string;
};

export const getWindowRouteUrl = ({ url, route }: WindowOptions) => {
  const toRoute = `#${route}`;

  return app.isPackaged ? `${url}${toRoute}` : `${url}/${toRoute}`;
};

export const getAppPath = () => {
  const appPath = app.getAppPath();

  return app.isPackaged
    ? appPath.replace('app.asar', 'app.asar.unpacked')
    : appPath;
};
