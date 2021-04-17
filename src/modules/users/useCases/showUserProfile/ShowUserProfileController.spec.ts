import "reflect-metadata";
import request from "supertest";
import { container } from "tsyringe";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let connection: Connection;

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to show an user profile", async () => {
    const createUser = container.resolve(CreateUserUseCase);
    const user: ICreateUserDTO = {
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    };
    await createUser.execute(user);
    const userAuth = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });
    const response = await request(app)
      .get("/profile")
      .send({
        email: "user@example.com",
        password: "userPassword",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
      expect(response.body).toHaveProperty('id');
  });
});
