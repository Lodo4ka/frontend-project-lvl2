import yaml from 'js-yaml';

export default (source1, source2) => [source1, source2].map((source) => yaml.load(source));
