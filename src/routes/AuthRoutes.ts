import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import SessionUtil from "@src/util/SessionUtil";
import AuthService from "@src/services/AuthService";

import { IReq, IRes } from "./types/express/misc";

// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}

// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, password } = req.body;
  // Login
  const user = await AuthService.login(email, password);
  // Setup Admin Cookie

  const token = await SessionUtil.addSessionData(res, {
    id: user.id,
    email: user.name,
    name: user.name,
    role: user.role,
  });
  // Return
  return res.status(HttpStatusCodes.OK).json({
    message: "login successful",
    data: {
      user: user,
      token: token,
    },
  });
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  SessionUtil.clearCookie(res);
  return res.status(HttpStatusCodes.OK).json({
    message: "logout successful",
    data: null,
  });
}

// **** Export default **** //

export default {
  login,
  logout,
} as const;
