import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import UserService from "@src/services/UserService";
import { IUser, UserDTO } from "@src/models/User";
import { IReq, IRes } from "./types/express/misc";
import { Messages } from "@src/services/AuthService";

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq<UserDTO>, res: IRes) {
  try {
    const body = req.body;
    const returnUser = await UserService.addOne(body);
    return res.status(HttpStatusCodes.CREATED).json({
      message: Messages.RegisterSuccess,
      data: {
        user: returnUser,
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
 * Update one user.
 */
async function update(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  console.log(req);
  return;

  await UserService.updateOne(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
