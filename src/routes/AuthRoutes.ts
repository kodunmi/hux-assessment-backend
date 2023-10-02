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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Login request body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Login success message.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Unauthorized error message.
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
