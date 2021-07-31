import yaml from 'js-yaml';

const parsers = {
  yml: (source) => yaml.load(source),
  yaml: (source) => yaml.load(source),
  json: (source) => JSON.parse(source),
};

const parse = (data, formatFile) => parsers[formatFile](data);

export default parse;
