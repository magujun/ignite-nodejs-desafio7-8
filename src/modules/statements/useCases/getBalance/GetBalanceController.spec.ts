import "reflect-metadata";
import request from "supertest";
import { container } from "tsyringe";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { CreateUserUseCase } from "@src/modules/users/useCases/createUser/CreateUserUseCase";
import { IGetBalanceDTO } from "./IGetBalanceDTO";

let connection: Connection;

describe("Get Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to get an user balance", async () => {
    const createUser = container.resolve(CreateUserUseCase);
    const user = {
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    };
    const newUser = await createUser.execute(user);
    const userAuth = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });
    await request(app)
      .post("/statements/deposit")
      .send({
        user_id: newUser.id,
        amount: 100,
        description: "Deposit 100",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    await request(app)
      .post("/statements/withdraw")
      .send({
        user_id: newUser.id,
        amount: 50,
        description: "Withdraw 50",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    const result = await request(app)
      .get("/statements/balance")
      .send({
        id: newUser.id,
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    expect(result.body).toHaveProperty("statement");
    expect(result.body.statement.length).toBe(2);
    expect(result.body).toHaveProperty("balance");
    expect(result.body.balance).toBe(50);
  });
});
