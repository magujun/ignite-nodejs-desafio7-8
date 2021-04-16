import "reflect-metadata";
import request from "supertest";
import { container } from "tsyringe";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    const createUser = container.resolve(CreateUserUseCase);
    await createUser.execute({
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    });
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to authenticate an user", async () => {
    const response = await request(app).post("/sessions").send({
      email: "user@example.com",
      password: "userPassword",
    });
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });
});
