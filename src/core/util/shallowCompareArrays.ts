export const shallowCompareArrays = (a: any[], b: any[]) => {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  const [longer, shorter] = a.length > b.length ? [a, b] : [b, a];
  for (let i = 0; i < longer.length; i++) {
    if (longer[i] !== shorter[i]) {
      return false;
    }
  }

  return true;
};
