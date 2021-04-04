import yaml from 'js-yaml';

export default (source1, source2) => {
  const dataYml1 = yaml.load(source1);
  const dataYml2 = yaml.load(source2);
  return [dataYml1, dataYml2];
};
