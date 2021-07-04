import jsonParser from './json-parser.mjs';
import ymlParser from './yml-parser.mjs';

const getParser = (typeFormatter) => {
  const parsers = {
    yml: ymlParser,
    json: jsonParser,
  };
  return parsers[typeFormatter];
};

export default getParser;
