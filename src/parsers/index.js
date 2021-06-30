import path from 'path';

import jsonParser from './json-parser.mjs';
import ymlParser from './yml-parser.mjs';

const getParsers = (pathFile) => {
  const format = path.extname(pathFile);
  const mapParser = {
    '.yml': ymlParser,
    '.json': jsonParser,
  };
  return mapParser[format];
};

export default getParsers;
