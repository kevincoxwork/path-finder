const singletonGetter = (constructor) => {
  let instance;
  return () => {
    if (!instance) {
      instance = new constructor();
    }
    return instance;
  };
};

export default singletonGetter;
