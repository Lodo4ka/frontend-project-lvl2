import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

const formatters = {
  stylish: stylishFormatter,
  plain: plainFormatter,
  json: (diff) => JSON.stringify(diff, null, 2),
};

const format = (data, formatterType) => formatters[formatterType](data);

export default format;
