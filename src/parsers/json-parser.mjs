export default (source1, source2) => {
  const dataJ1 = JSON.parse(source1);
  const dataJ2 = JSON.parse(source2);
  return [dataJ1, dataJ2];
};
