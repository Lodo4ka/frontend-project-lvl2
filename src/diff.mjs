import {
  union, isEqual, has, isObject, get, isEmpty, uniq,
} from 'lodash-es';

export default (source1, source2) => {
  if (isEqual(source1, source2)) {
    return source2;
  }
  const keyValues1 = Object.entries(source1);
  const keyValues2 = Object.entries(source2);
  const unionKeyValues = union(keyValues1, keyValues2);
  const childrenSetStatus = (children, statusArg) => Object.entries(children)
    .reduce((acc, [key, value]) => (!isEmpty(value)
      ? childrenSetStatus(value, statusArg) : { ...acc, [key]: { ...value, status: statusArg } }));
  const getStatuses = (children) => Object.values(children)
    .map(({ status, childrenNode }) => (!isEmpty(childrenNode)
      ? getStatuses(childrenNode) : status));
  const hasChangeNodes = (childrenArg) => getStatuses(childrenArg).includes('changed');
  const generateAstDiff = (values, parent) => {
    const result = values
      .reduce((acc, [key, value]) => {
        const currentKey = [...parent, key].join('.');
        let status = 'unchanged';
        let children = {};
        if (isObject(value)) {
          const childrenNode = Object.entries(value);
          children = generateAstDiff(childrenNode, [...parent, key]);
          const areChangeNodes = hasChangeNodes(children);
          const prevChildren = acc[key]?.children ?? {};
          if (areChangeNodes) {
            return { ...acc, [key]: { status, children: { ...prevChildren, ...children } } };
          }
          const statuses = uniq(getStatuses(children));
          const hasSameStatus = statuses.length === 1;
          if (hasSameStatus) {
            return {
              ...acc,
              [key]: {
                status: statuses[0],
                children: { ...prevChildren, ...childrenSetStatus(children, status) },
              },
            };
          }
        }
        if (!has(source1, currentKey)) {
          status = 'added';
        } else if (!has(source2, currentKey)) {
          status = 'deleted';
        } else if (get(source1, currentKey) !== get(source2, currentKey)) {
          status = 'changed';
        }
        return { ...acc, [key]: { status, children } };
      }, {});
    return result;
  };
  const diffInfo = generateAstDiff(unionKeyValues, []);
  return { diffInfo, source1, source2 };
};
