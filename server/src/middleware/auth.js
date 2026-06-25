const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../constants/roles');

const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized. Please log in.', 401));
  }

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated.', 403));
  }

  if (decoded.role !== user.role) {
    return next(
      new AppError('Your role has changed. Please log in again.', 401)
    );
  }

  req.user = user;
  next();
});

const authorize = (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };

const authorizeAdmin = authorize(ROLES.ADMIN);
const authorizeVolunteer = authorize(ROLES.ADMIN, ROLES.VOLUNTEER);
const authorizeDonor = authorize(ROLES.ADMIN, ROLES.DONOR);

module.exports = {
  protect,
  authorize,
  authorizeAdmin,
  authorizeVolunteer,
  authorizeDonor,
};
