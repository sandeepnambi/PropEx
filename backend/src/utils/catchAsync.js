const catchAsync = (fn) => {
  return (req, res, next) => {
    // Executes the async function and catches any rejection (error), passing it to Express
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
