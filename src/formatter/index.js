import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';
import jsonFormatter from './json.js';

const mapFormatter = {
  stylish: stylishFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
};

const getFormatter = (choisesFormatter) => mapFormatter[choisesFormatter];

export default getFormatter;
