import { IUser, UserDTO, UserUpdateDTO } from "@src/models/User";
import { getRandomInt } from "@src/util/misc";
import orm from "./MockOrm";
import { myDataSource } from "@src/app-data-source";
import { User } from "@src/entity/user.entity";
import PwdUtil from "@src/util/PwdUtil";
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { Errors } from "@src/services/AuthService";

// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(email: string): Promise<User | null> {
  const user = await myDataSource.getRepository(User).findOneBy({
    email: email,
  });

  return user;
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const user = await myDataSource.getRepository(User).findOneBy({
    id: id,
  });

  if (user) {
    return true;
  }

  return false;
}

/**
 * Get all users.
 */
async function getAll(): Promise<User[]> {
  const users = await myDataSource.getRepository(User).find();

  return users;
}

/**
 * Add one user.
 */
async function add({ name, email, password }: UserDTO): Promise<User> {
  let existingUser = await getOne(email);

  if (existingUser) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.DuplicateUser);
  }

  console.log("password", PwdUtil.getHash(password));

  const userObj = myDataSource.getRepository(User).create({
    name: name,
    email: email,
    password: await PwdUtil.getHash(password),
  } as Object);
  const result = await myDataSource.getRepository(User).save(userObj);
  return result;
}

/**
 * Update a user.
 */
async function update(userDTO: UserUpdateDTO): Promise<void> {
  const user = await myDataSource.getRepository(User).findOneBy({
    id: userDTO.id,
  });

  // const results = await myDataSource
  //   .getRepository(User)
  //   .save({ ...user, ...userDTO });
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<boolean> {
  const result = await myDataSource.getRepository(User).delete(id);

  return result.affected ? true : false;
}

// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
} as const;
