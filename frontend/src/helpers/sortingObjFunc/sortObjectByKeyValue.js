const compareObjectByValue = (key) => {
  return (a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
};

export const sortObjectsByKeyValue = (objects, key) => {
  return objects.sort(compareObjectByValue(key));
};
