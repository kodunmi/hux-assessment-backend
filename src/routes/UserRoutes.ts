import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import UserService from "@src/services/UserService";
import { IUser, UserDTO } from "@src/models/User";
import { IReq, IRes } from "./types/express/misc";

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
  const body = req.body;
  const returnUser = await UserService.addOne(body);
  return res.status(HttpStatusCodes.CREATED).json({
    message: "user added successfully",
    data: {
      user: returnUser,
    },
  });
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
