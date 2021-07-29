import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

const formatters = {
  stylish: stylishFormatter,
  plain: plainFormatter,
  json: (diff) => JSON.stringify(diff, null, 2),
};

const format = (data, choisesFormatter) => formatters[choisesFormatter](data);

export default format;
