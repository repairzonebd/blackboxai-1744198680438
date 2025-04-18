// Wrapper for async routes to handle errors without try-catch blocks
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
};

module.exports = asyncHandler;