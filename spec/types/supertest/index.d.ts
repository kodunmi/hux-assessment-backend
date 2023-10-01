import { User } from "@src/entity/user.entity";
import { IUser } from "@src/models/User";
import "supertest";

declare module "supertest" {
  export interface Response {
    headers: Record<string, string[]>;
    body: {
      message?: string;
      data?: {
        user: User;
        token?: string;
      };
    };
  }
}
