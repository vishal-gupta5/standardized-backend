import * as authServices from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

// Register

const register = async (req, res) => {
  const user = await authServices.register(req.body);
  ApiResponse.created(res, "Registration Successful!", user);
};

// Login

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authServices.login(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  ApiResponse.ok(res, "Login Successful!", { user, accessToken });
};

// Logout

const logout = async (req, res) => {
  await authServices.logout(req.user.id);
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "Logout Successful!");
};

// GetMe
const getMe = async (req, res) => {
  const user = await authServices.getMe(req.user.id);
  ApiResponse.ok(res, "User Profile!", user);
};
export { register, login, logout, getMe };
