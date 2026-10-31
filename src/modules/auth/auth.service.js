import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../../common/utils/jwt.utils.js";

const hasToken = (token) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflit("User already exists!");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    varificationToken: hashedToken,
  });

  // Todo: send an email to user with token: rawToken

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.varificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw ApiError.unauthorized("Invalid Email or Password!");
  }

  // Somehow I will check password
  if (!user.isVerified) {
    throw new ApiError.forbedden("Please Verify your email before login!");
  }

  const accessToken = await generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken({ id: user._id });

  user.refreshToken = hasToken(refreshToken);

  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

export { register };
