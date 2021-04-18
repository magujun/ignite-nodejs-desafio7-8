import "reflect-metadata";
import { CreateUserUseCase } from "@src/modules/users/useCases/createUser/CreateUserUseCase";
import request from "supertest";
import { container } from "tsyringe";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Show Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to show a statement operation", async () => {
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
    const statement1: any = await request(app)
      .post("/statements/deposit")
      .send({
        user_id: newUser.id,
        amount: 100,
        description: "Deposit 100",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    const statement2: any = await request(app)
      .post("/statements/withdraw")
      .send({
        user_id: newUser.id,
        amount: 50,
        description: "Withdraw 50",
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    const result1 = await request(app)
      .get("/statements/" + statement1.body.id)
      .send({
        id: newUser.id,
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    expect(result1.body).toHaveProperty("id");
    expect(result1.body.type).toBe("deposit");
    expect(result1.body.amount).toBe("100.00");
    const result2 = await request(app)
      .get("/statements/" + statement2.body.id)
      .send({
        id: newUser.id,
      })
      .set({
        Authorization: `bearer ${userAuth.body.token}`,
      });
    expect(result2.body).toHaveProperty("id");
    expect(result2.body.type).toBe("withdraw");
    expect(result2.body.amount).toBe("50.00");
  });
});
