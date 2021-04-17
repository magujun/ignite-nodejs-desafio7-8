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
type NewType = CreateUserUseCase;

let createUserUseCase: NewType;

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
  it("Should be able to create a new statement", async () => {
    const newUser: ICreateUserDTO = {
      name: "User1",
      email: "user1@example.com",
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
    const statement2: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Withdraw 50",
    };
    const result2 = await createStatementUseCase.execute(statement2);
    expect(result2).toHaveProperty("amount");
    expect(result2.amount).toBe(statement2.amount);
    expect(async () => {
      const statement3: ICreateStatementDTO = {
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Withdraw 100",
      };
      const result3 = await createStatementUseCase.execute(statement3);
    }).rejects.toBeInstanceOf(AppError);
    const statement4: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: "Deposit 50",
    };
    const result4 = await createStatementUseCase.execute(statement4);
    expect(result4).toHaveProperty("amount");
    expect(result4.amount).toBe(statement4.amount);
  });
});
