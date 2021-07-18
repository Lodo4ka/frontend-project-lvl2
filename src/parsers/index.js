import jsonParser from './json-parser.js';
import ymlParser from './yml-parser.js';

const parsers = {
  yml: ymlParser,
  yaml: ymlParser,
  json: jsonParser,
};

const getParser = (typeFormatter) => parsers[typeFormatter];

export default getParser;
