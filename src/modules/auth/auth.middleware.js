import ApiError from "../../common/utils/api-error";
import { generateAccessToken } from "../../common/utils/jwt.utils";
import User from "./auth.model";

const authenticate = async (req, res, next) => {
  let token;

  if (!req.headers.authorization?.startsWtih("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError.unauthorized("Not Authenticated!");
  }

  const decoded = await generateAccessToken(token);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError.unauthorized("User no longer exists!");
  }

  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  next();
};

const authorize = async (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new ApiError.forbedden(
        "You don't have permission to perform this action",
      );
    }
    next();
  };
};

export { authenticate, authorize };
