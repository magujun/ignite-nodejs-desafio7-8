import "reflect-metadata";
import request from "supertest";
import { container } from "tsyringe";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { CreateUserUseCase } from "@src/modules/users/useCases/createUser/CreateUserUseCase";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to create new deposit & withdrawal statements", async () => {
    const createUser = container.resolve(CreateUserUseCase);
    const user = {
      name: "User1",
      email: "user1@example.com",
      password: "userPassword",
    };
    const newUser = await createUser.execute(user);
    const userAuth = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });
    const response1 = await request(app)
      .post("/statements/deposit")
      .send({
        user_id: newUser.id,
        amount: 100,
        description: "Deposit 100",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    expect(response1.status).toBe(201);
    expect(response1.body).toHaveProperty("amount");
    expect(response1.body.amount).toBe(100);
    const response2 = await request(app)
      .post("/statements/withdraw")
      .send({
        user_id: newUser.id,
        amount: 50,
        description: "Withdraw 50",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    expect(response2.status).toBe(201);
    expect(response2.body).toHaveProperty("amount");
    expect(response2.body.amount).toBe(50);
  });
  it("Should not be able to create new withdrawal statements if funds are not sufficient", async () => {
    const createUser = container.resolve(CreateUserUseCase);
    const user = {
      name: "User2",
      email: "user2@example.com",
      password: "userPassword",
    };
    const newUser = await createUser.execute(user);
    const userAuth = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });
    const response3 = await request(app)
      .post("/statements/withdraw")
      .send({
        user_id: newUser.id,
        amount: 100,
        description: "Withdraw 100",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    expect(response3.status).toBe(400);
  });
  it("Should not be able to create new statements if token is not valid", async () => {
    const createUser = container.resolve(CreateUserUseCase);
    const user = {
      name: "User3",
      email: "user3@example.com",
      password: "userPassword",
    };
    const newUser = await createUser.execute(user);
    const response4 = await request(app)
      .post("/statements/withdraw")
      .send({
        user_id: newUser.id,
        amount: 100,
        description: "Withdraw 100",
      })
      .set({
        Authorization: 'invalidToken',
      });
    expect(response4.status).toBe(401);
  });
  it("Should not be able to create new statements without token", async () => {
    const createUser = container.resolve(CreateUserUseCase);
    const user = {
      name: "User4",
      email: "user4@example.com",
      password: "userPassword",
    };
    const newUser = await createUser.execute(user);
    const response4 = await request(app)
      .post("/statements/withdraw")
      .send({
        user_id: newUser.id,
        amount: 100,
        description: "Withdraw 100",
      })
    expect(response4.status).toBe(401);
  });
});
