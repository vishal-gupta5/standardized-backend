import * as authServices from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
  const user = await authServices.register(req.body);
  ApiResponse.created(res, "Registration Successful!", user);
};

export { register };
