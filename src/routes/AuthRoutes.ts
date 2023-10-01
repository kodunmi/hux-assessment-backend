import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import SessionUtil from "@src/util/SessionUtil";
import AuthService, { Messages } from "@src/services/AuthService";

import { IReq, IRes } from "./types/express/misc";
import { RouteError } from "@src/other/classes";

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
  try {
    const { email, password } = req.body;
    // Login
    const user = await AuthService.login(email, password);

    // console.log(user);

    // Setup Admin Cookie

    const token = await SessionUtil.addSessionData(res, {
      id: user.id,
      email: user.name,
      name: user.name,
      role: user.role,
    });
    // Return
    return res.status(HttpStatusCodes.OK).json({
      message: Messages.LoginSuccess,
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    return res.status(error.status).json({
      message: error.message,
      data: null,
    });
  }
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
