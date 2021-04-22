import {
  isEmpty,
} from 'lodash-es';

const hasChildren = (children) => !isEmpty(children);

export default hasChildren;
