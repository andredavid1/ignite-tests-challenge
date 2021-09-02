/* eslint-disable no-undef */
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from 'uuid';
import { hash } from "bcryptjs";

import createConnection from "../../../../database";
import {app} from '../../../../app';

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate a user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "any_name",
        email: "any_mail.com",
        password: "any_password"
      });

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "any_mail.com",
        password: "any_password"
      });

    expect(response.status).toBe(200);
  });
});
