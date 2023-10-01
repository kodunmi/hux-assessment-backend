import supertest, { SuperTest, Test, Response, Request } from "supertest";

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
import ContactService, { ContactMessages } from "@src/services/ContactService";

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

// JWT token to store the token after login
let jwtToken: string | null = null;

describe("ContactRouter", () => {
  let agent: SuperTest<Test>;

  // Run before all tests
  beforeAll((done) => {
    agent = supertest.agent(app);

    // register a new user

    (async function () {
      const regBody = await agent
        .post(Paths.Auth.Register)
        .type("form")
        .send(RegDetail);

      console.log("created body", regBody);

      // Perform a login to get the JWT token
      const response = await agent
        .post(Paths.Auth.Login)
        .type("form")
        .send({ email: RegDetail.email, password: RegDetail.password });

      console.log("login body", response);

      // Extract the JWT token from the response
      jwtToken = response.body.data.token;

      console.log("token is ", response);
    })()
      .then(done)
      .catch(done.fail);

    // Perform a login to get the JWT token
  });

  // Define a function to add the Authorization Bearer token to requests
  const withAuthorization = (request: any) => {
    return jwtToken
      ? request.set("Authorization", `Bearer ${jwtToken}`)
      : request;
  };

  // ** Test getting all contacts ** //
  describe(`"GET:${Paths.Contacts.Get}"`, () => {
    // Mocked contacts data
    const mockedContacts = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "+9876543210",
      },
    ];

    const callApi = () => withAuthorization(agent.get(Paths.Contacts.Get));

    // Successful retrieval of all contacts
    it(`should return a response with a status of ${HttpStatusCodes.OK}`, (done) => {
      // Mock the ContactService's getAll method to return the mocked contacts
      spyOn(ContactService, "getAll").and.resolveTo(mockedContacts);

      callApi().end((_: Error, res: Response) => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.data!.contacts).toEqual(mockedContacts);
        done();
      });
    });

    // Error case: You can write tests for error scenarios as well
  });

  // ** Test creating a contact ** //
  describe(`"POST:${Paths.Contacts.Add}"`, () => {
    const newContact = {
      id: 1,
      firstName: "New",
      lastName: "Contact",
      phoneNumber: "07031632425",
    };

    const callApi = (reqBody: TReqBody) =>
      withAuthorization(
        agent.post(Paths.Contacts.Add).type("form").send(reqBody)
      );

    // Successful creation of a contact
    it(`should return a response with a status of ${HttpStatusCodes.CREATED}`, (done) => {
      // Mock the ContactService's createOne method to return the newly created contact
      spyOn(ContactService, "createOne").and.resolveTo(newContact);

      callApi(newContact).end((_: Error, res: Response) => {
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body.message).toContain(ContactMessages.Created);
        done();
      });
    });
  });

  // ** Test updating a contact ** //
  describe(`"PUT:${Paths.Contacts.Update}"`, () => {
    const contactId = 1; // ID of the contact to update
    const updatedContact = {
      id: contactId,
      firstName: "Updated",
      lastName: "Contact",
      phoneNumber: "+2222222222",
    };

    const callApi = (reqBody: TReqBody) =>
      withAuthorization(
        agent
          .put(Paths.Contacts.Update.replace(":id", contactId.toString()))
          .type("form")
          .send(reqBody)
      );

    // Successful update of a contact
    it(`should return a response with a status of ${HttpStatusCodes.OK}`, (done) => {
      // Mock the ContactService's updateOne method to return the updated contact
      spyOn(ContactService, "updateOne").and.resolveTo(updatedContact);

      callApi(updatedContact).end((_: Error, res: Response) => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.message).toContain(ContactMessages.Updated);
        done();
      });
    });

    // Error case: You can write tests for error scenarios as well
  });

  // ** Test deleting a contact ** //
  describe(`"DELETE:${Paths.Contacts.Delete}"`, () => {
    const contactId = 1; // ID of the contact to delete

    const callApi = () =>
      withAuthorization(
        agent.delete(Paths.Contacts.Delete.replace(":id", contactId.toString()))
      );

    // Successful deletion of a contact
    it(`should return a response with a status of ${HttpStatusCodes.OK}`, (done) => {
      // Mock the ContactService's deleteOne method to return true
      spyOn(ContactService, "deleteOne").and.resolveTo(true);

      callApi().end((_: Error, res: Response) => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.message).toContain(ContactMessages.Deleted);
        done();
      });
    });

    // Error case: You can write tests for error scenarios as well
  });

  // ** Test getting one contact by phone ** //
  describe(`"GET:${Paths.Contacts.GetOne}"`, () => {
    const contactPhone = "07031632426"; // Email of the contact to retrieve

    const mockedContact = {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "+9876543210",
    };

    const callApi = () =>
      withAuthorization(
        agent.get(Paths.Contacts.GetOne.replace(":phoneNumber", contactPhone))
      );

    // Successful retrieval of one contact by email
    it(`should return a response with a status of ${HttpStatusCodes.OK}`, (done) => {
      // Mock the ContactService's getOneByEmail method to return the contact
      spyOn(ContactService, "getOne").and.resolveTo(mockedContact);

      callApi().end((_: Error, res: Response) => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.message).toEqual(ContactMessages.Retrieved);
        done();
      });
    });

    // Error case: You can write tests for error scenarios as well
  });
});
