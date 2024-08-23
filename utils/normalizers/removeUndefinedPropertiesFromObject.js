export const removeUndefinedPropertiesFromObject = (obj) =>
  Object.keys(obj).reduce((newObj, current) => {
    if (typeof obj[current] !== "undefined") {
      return {
        ...newObj,
        [current]: obj[current],
      };
    }

    return newObj;
  }, {});
