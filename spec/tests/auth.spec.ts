import supertest, { SuperTest, Test, Response } from "supertest";

import app from "@src/server";

import UserRepo from "@src/repos/UserRepo";
import PwdUtil from "@src/util/PwdUtil";
import User, { UserRoles } from "@src/models/User";
import { Errors, Messages } from "@src/services/AuthService";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import Paths from "spec/support/Paths";
import { TReqBody } from "spec/support/types";
import { getRandomInt } from "@src/util/misc";

// **** Variables **** //

// StatusCodes
const { OK, UNAUTHORIZED, BAD_REQUEST, CREATED } = HttpStatusCodes;

// Login credentials
const LoginCreds = {
  email: "lekan@hdhd.cccc",
  password: "12345",
} as const;

const RegDetail = {
  email: `${getRandomInt()}@test.com"`,
  password: "12345",
  name: "Lekan kodunmi",
};

// **** Tests **** //

describe("AuthRouter", () => {
  let agent: SuperTest<Test>;

  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  // ** Test login ** //
  describe(`"POST:${Paths.Auth.Login}"`, () => {
    const EMAIL_NOT_FOUND_ERR = Errors.EmailNotFound(LoginCreds.email);

    const callApi = (reqBody: TReqBody) =>
      agent.post(Paths.Auth.Login).type("form").send(reqBody);

    // Success
    it(`should return a response with a status of "${OK}" and message of  `, (done) => {
      // Setup data
      const role = UserRoles.Standard,
        pwdHash = PwdUtil.hashSync(LoginCreds.password),
        loginUser = User.new("john smith", LoginCreds.email, role, pwdHash);
      // Add spy
      spyOn(UserRepo, "getOne").and.resolveTo(loginUser);
      // Call API
      callApi(LoginCreds).end((_: Error, res: Response) => {
        expect(res.status).toBe(OK);

        console.log("login response", res.body.data);

        expect(res.body.message).toContain(Messages.LoginSuccess);
        done();
      });
    });

    // Email not found error
    it(
      `should return a response with a status of "${UNAUTHORIZED}" and a ` +
        `json with an error message of "${EMAIL_NOT_FOUND_ERR}" if the email ` +
        "was not found.",
      (done) => {
        // Spy
        spyOn(UserRepo, "getOne").and.resolveTo(null);
        // Call
        callApi(LoginCreds).end((_: Error, res: Response) => {
          expect(res.status).toBe(UNAUTHORIZED);
          expect(res.body.message).toBe(EMAIL_NOT_FOUND_ERR);
          done();
        });
      }
    );

    // Password failed
    it(
      `should return a response with a status of "${UNAUTHORIZED}" and a ` +
        `json with the error "${Errors.Unauth}" if the password failed.`,
      (done) => {
        // Setup data
        const role = UserRoles.Standard,
          pwdHash = PwdUtil.hashSync("bad password"),
          loginUser = User.new("john smith", LoginCreds.email, role, pwdHash);
        // Add spy
        spyOn(UserRepo, "getOne").and.resolveTo(loginUser);
        // Call API
        callApi(LoginCreds).end((_: Error, res: Response) => {
          expect(res.status).toBe(UNAUTHORIZED);
          expect(res.body.message).toBe(Errors.Unauth);
          done();
        });
      }
    );
  });

  // ** Test Signup ** //
  describe(`"POST:${Paths.Auth.Register}"`, () => {
    const callApi = (reqBody: TReqBody) =>
      agent.post(Paths.Auth.Register).type("form").send(reqBody);

    console.log("outter", RegDetail);

    // Success
    it(`should return a response with a status of "${OK}" and message of ${Messages.RegisterSuccess} `, (done) => {
      // Call API

      // spyOn(UserRepo, "add").and.resolveTo(RegDetail);
      callApi(RegDetail).end((_: Error, res: Response) => {
        expect(res.status).toBe(CREATED);
        expect(res.body.message).toContain(Messages.RegisterSuccess);
        // Now, you can proceed with the second test

        done();
      });
    });
  });

  // ** Test logout ** //
  describe(`"GET:${Paths.Auth.Logout}"`, () => {
    // Successful logout
    it(`should return a response with a status of ${OK}`, (done) => {
      agent.get(Paths.Auth.Logout).end((_: Error, res: Response) => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });
  });
});
