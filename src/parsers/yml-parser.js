import yaml from 'js-yaml';

export default (...sources) => sources.map((source) => yaml.load(source));
