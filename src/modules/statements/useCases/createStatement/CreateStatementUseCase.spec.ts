import { InMemoryUsersRepository } from "@src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@src/modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@src/modules/users/useCases/createUser/ICreateUserDTO";
import { AppError } from "@src/shared/errors/AppError";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("[Create a new statement service]", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });
  it("Should be able to create a new deposit statement", async () => {
    const newUser: ICreateUserDTO = {
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    };
    const user: any = await createUserUseCase.execute(newUser);
    const statement1: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit 100",
    };
    const result1 = await createStatementUseCase.execute(statement1);
    expect(result1).toHaveProperty("amount");
    expect(result1.amount).toBe(statement1.amount);
  });
  it("Should be able to create a new withdraw statement", async () => {
    const newUser: ICreateUserDTO = {
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    };
    const user: any = await createUserUseCase.execute(newUser);
    const statement1: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit 100",
    };
    await createStatementUseCase.execute(statement1);
    const statement2: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Withdraw 50",
    };
    const result2 = await createStatementUseCase.execute(statement2);
    expect(result2).toHaveProperty("amount");
    expect(result2.amount).toBe(statement2.amount);
  });
  it("Should not be able to create a new withdraw statement with insufficient funds", async () => {
    const newUser: ICreateUserDTO = {
      name: "User",
      email: "user@example.com",
      password: "userPassword",
    };
    const user: any = await createUserUseCase.execute(newUser);
    expect(async () => {
      const statement3: ICreateStatementDTO = {
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Withdraw 100",
      };
      await createStatementUseCase.execute(statement3);
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to create a new statement for an invalid user", async () => {
    expect(async () => {
      const statement4: ICreateStatementDTO = {
        user_id: "invalidUser",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Deposit 100",
      };
      const result = await createStatementUseCase.execute(statement4);
    }).rejects.toBeInstanceOf(AppError);
  });
});