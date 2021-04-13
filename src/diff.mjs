import {
  union, isEqual, has, isObject, get, isEmpty, uniq, sortBy,
} from 'lodash-es';

export default (source1, source2) => {
  if (isEqual(source1, source2)) {
    return source2;
  }
  const keyValues1 = Object.entries(source1);
  const keyValues2 = Object.entries(source2);
  const unionKeyValues = union(keyValues1, keyValues2);

  const setChildrenStatus = (children, statusArg) => {
    const iter = (childrenArg) => Object.entries(childrenArg)
      .reduce((acc, [key, { children: childrenNode }]) => ({
        ...acc,
        [key]: {
          status: statusArg,
          children: !isEmpty(childrenNode) ? iter(childrenNode, statusArg) : childrenNode,
        },
      }), {});
    return iter(children, statusArg);
  };

  const getStatuses = (children) => Object.values(children)
    .flatMap(({ status, children: childrenNode }) => (!isEmpty(childrenNode)
      ? getStatuses(childrenNode) : status));

  const haveChangeNodes = (childrenArg) => getStatuses(childrenArg).includes('changed');

  const haveSameStatus = (children) => {
    const statuses = uniq(getStatuses(children));
    return statuses.length === 1;
  };

  const generateAstDiff = (values, parent) => {
    const result = values
      .reduce((acc, [key, value]) => {
        const currentKey = [...parent, key].join('.');
        let status = 'unchanged';
        let children = {};
        if (isObject(value)) {
          const childrenNode = Object.entries(value);
          children = generateAstDiff(childrenNode, [...parent, key]);
        }
        if (!has(source1, currentKey)) {
          status = 'added';
        } else if (!has(source2, currentKey)) {
          status = 'deleted';
        } else if (get(source1, currentKey) !== get(source2, currentKey)) {
          status = 'changed';
        }
        return {
          ...acc,
          [key]: {
            status,
            children: { ...get(acc, currentKey)?.children, ...children },
          },
        };
      }, {});
    return result;
  };

  const ast = generateAstDiff(unionKeyValues, []);

  const formatNestedAst = (astArg) => Object.entries(astArg)
    .reduce((acc, [key, { children, status }]) => {
      let newChildren = children;
      let newStatus = '';
      if (!isEmpty(children)) {
        newStatus = haveChangeNodes(children) ? 'unchanged' : status;
        if (haveSameStatus(children) && newStatus !== 'unchanged') {
          [newStatus] = getStatuses(children);
          newChildren = setChildrenStatus(children, 'unchanged');
          return { ...acc, [key]: { children: formatNestedAst(newChildren), status: newStatus } };
        }
        return { ...acc, [key]: { children: formatNestedAst(newChildren), status: newStatus } };
      }
      return { ...acc, [key]: { children: newChildren, status } };
    }, {});
  const diffInfo = formatNestedAst(ast);
  const hasChildren = (children) => !isEmpty(children);
  const sortByKey = (obj) => sortBy(Object.entries(obj), ([key]) => key)
    .map(([key, val]) => (hasChildren(val.children)
      ? [key, { ...val, children: sortByKey(val.children) }] : [key, val]));
  const sortDiffInfo = sortByKey(diffInfo);
  return { diffInfo: sortDiffInfo, source1, source2 };
};
