import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';
import jsonFormatter from './json.js';

const getFormatter = (choisesFormatter) => {
  const mapFormatter = {
    stylish: stylishFormatter,
    plain: plainFormatter,
    json: jsonFormatter,
  };
  return mapFormatter[choisesFormatter];
};

export default getFormatter;
