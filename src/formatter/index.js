import stylishFormatter from './stylish.mjs';
import plainFormatter from './plain.mjs';
import jsonFormatter from './json.mjs';

const getFormatter = (choisesFormatter) => {
  const mapFormatter = {
    stylish: stylishFormatter,
    plain: plainFormatter,
    json: jsonFormatter,
  };
  return mapFormatter[choisesFormatter];
};

export default getFormatter;
