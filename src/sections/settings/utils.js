export const shallowEqual = (objA, objB) => {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);

  return aKeys.length === bKeys.length && aKeys.every((key) => objA[key] === objB[key]);
};
