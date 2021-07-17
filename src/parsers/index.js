import jsonParser from './json-parser.js';
import ymlParser from './yml-parser.js';

const getParser = (typeFormatter) => {
  const parsers = {
    yml: ymlParser,
    json: jsonParser,
  };
  return parsers[typeFormatter];
};

export default getParser;
