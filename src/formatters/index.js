import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';
import jsonFormatter from './json.js';

const formatters = {
  stylish: stylishFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
};

const getFormatter = (data, choisesFormatter) => formatters[choisesFormatter](data);

export default getFormatter;
