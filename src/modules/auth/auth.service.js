import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";

// hasToken
const hasToken = (token) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

// Register

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

// Login

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+email");

  if (!user) {
    throw ApiError.unauthorized("Invalid Email or Password!");
  }

  // Somehow I will check password

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError.unauthorized("Invalid email or password!");
  }

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

// Refresh

const refresh = async (token) => {
  if (!token) {
    throw new ApiError.unauthorized("Refresh token is missing!");
  }

  const decode = verifyRefreshToken(token);

  const user = await User.findOne(decode.id).select("+refreshToken");

  if (!user) {
    throw new ApiError.unauthorized("User not found!");
  }

  if (user.refreshToken !== hasToken(refreshToken)) {
    throw new ApiError.unauthorized("Invalid Refresh token!");
  }

  const accessToken = await generateAccessToken({
    id: user._id,
    role: user.role,
  });

  return { accessToken };
};

// Logout

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// Forget Password

const forgetPassword = async () => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError.unauthorized("No email with this email!");
  }

  const { rawToken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  // TODO: mail bhejna nhi aata hai
};

// GetMe

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError.noFound("User Not found!");
  }
  return user;
};

export { register, refresh, login, logout, forgetPassword, getMe };
