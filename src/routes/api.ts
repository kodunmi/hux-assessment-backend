import { Router } from "express";
import jetValidator from "jet-validator";

import adminMw from "./middleware/adminMw";
import Paths from "../constants/Paths";
import User from "@src/models/User";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import ContactRoutes from "./ContactRoutes"; // Import the ContactRoutes module
import verifyJwt from "./middleware/protectRoute";
import { validatePhoneNumber } from "@src/util/misc";

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// **** Setup AuthRouter **** //

const authRouter = Router();

// Login user
authRouter.post(
  Paths.Auth.Login,
  validate("email", "password"),
  AuthRoutes.login
);

// register user

authRouter.post(
  Paths.Auth.Register,
  validate(["email", User.isEmail], "name", "password"),
  UserRoutes.add
);

// Logout user
authRouter.get(Paths.Auth.Logout, AuthRoutes.logout);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(["user", User.isUser]),
  UserRoutes.add
);

// Update one user
userRouter.put(
  Paths.Users.Update,
  // validate(["user", User.isUser]),

  UserRoutes.update
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  validate(["id", "number", "params"]),
  UserRoutes.delete
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, verifyJwt, userRouter);

// ** Add ContactRouter ** //

const contactRouter = Router();

// Get all contacts
contactRouter.get(Paths.Contacts.Get, verifyJwt, ContactRoutes.getAll);

// Add one contact
contactRouter.post(
  Paths.Contacts.Add,
  verifyJwt,
  validate(
    ["phoneNumber", validatePhoneNumber],
    ["firstName", "string"],
    ["lastName", "string"]
  ),
  ContactRoutes.createOne
);

// Update one contact
contactRouter.put(
  Paths.Contacts.Update,
  verifyJwt,
  validate(["id", "number", "params"]),
  ContactRoutes.updateOne
);

// Delete one contact
contactRouter.delete(
  Paths.Contacts.Delete,
  verifyJwt,
  validate(["id", "number", "params"]),
  ContactRoutes.deleteOne
);

// Get one contact by email
contactRouter.get(
  Paths.Contacts.GetOne,
  verifyJwt,
  validate(["phoneNumber", validatePhoneNumber, "params"]),
  ContactRoutes.getOne
);

// Add ContactRouter
apiRouter.use(Paths.Contacts.Base, contactRouter);

// **** Export default **** //

export default apiRouter;
