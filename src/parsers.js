import yaml from 'js-yaml';

const parsers = {
  yml: (source) => yaml.load(source),
  yaml: (source) => yaml.load(source),
  json: (source) => JSON.parse(source),
};

export default (data, formatFile) => parsers[formatFile](data);
