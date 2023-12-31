import UserRepo from "@src/repos/UserRepo";

import PwdUtil from "@src/util/PwdUtil";
import { tick } from "@src/util/misc";

import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { RouteError } from "@src/other/classes";
import { IUser } from "@src/models/User";
import { User } from "@src/entity/user.entity";

// **** Variables **** //

// Errors
export const Errors = {
  Unauth: "Unauthorized",
  EmailNotFound(email: string) {
    return `User with email "${email}" not found`;
  },
  DuplicateUser: "User with email already exist",
  DuplicateContact: "Phone number is already saved",
  ContactNotFound: "No contact with id available",
} as const;

// Messages

export const Messages = {
  LoginSuccess: "Login successful",
  RegisterSuccess: "Registration successful",
};

// **** Functions **** //

/**
 * Login a user.
 */
async function login(email: string, password: string): Promise<User> {
  // Fetch user
  const user = await UserRepo.getOne(email);
  if (!user) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.EmailNotFound(email)
    );
  }
  // Check password
  const hash = user.password ?? "",
    pwdPassed = await PwdUtil.compare(password, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, Errors.Unauth);
  }
  // Return
  return user;
}

// **** Export default **** //

export default {
  login,
} as const;
