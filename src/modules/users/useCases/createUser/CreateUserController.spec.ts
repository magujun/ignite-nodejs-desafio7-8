import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    });
    // console.log(response);
    expect(response.status).toBe(201);
  });
});
