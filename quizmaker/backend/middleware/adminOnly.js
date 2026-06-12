import asyncHandler from 'express-async-handler';

const adminOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required');
  }
  next();
});

export default adminOnly;
