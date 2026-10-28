import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import { generateResetToken } from "../../common/utils/jwt.utils.js";

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

export { register };
