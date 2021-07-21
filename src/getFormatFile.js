import path from 'path';

export default (pathName) => {
  const format = path.extname(pathName);
  const extName = format.match(/([^.]+)/g);
  return extName;
};
