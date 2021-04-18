import { InMemoryUsersRepository } from "@src/modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@src/modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@src/modules/users/useCases/createUser/ICreateUserDTO";
import { AppError } from "@src/shared/errors/AppError";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IGetStatementOperationDTO } from "./IGetStatementOperationDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("[Show statement operation service]", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });
  it("Should be able to show a statement operation", async () => {
    const newUser: ICreateUserDTO = {
      name: "User1",
      email: "user1@example.com",
      password: "userPassword",
    };
    const user: any = await createUserUseCase.execute(newUser);
    const statement: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit 100",
    };
    const getStatement: any = await createStatementUseCase.execute(statement);
    const getStatementOperation: IGetStatementOperationDTO = {
      user_id: user.id,
      statement_id: getStatement.id,
    };
    const result = await getStatementOperationUseCase.execute(
      getStatementOperation
    );
    expect(result).toHaveProperty("id");
    expect(result.amount).toBe(100);
  });
  it("Should not be able to show a statement operation for an invalid user or statement", async () => {
    expect(async () => {
      const getStatementOperation: IGetStatementOperationDTO = {
        user_id: "invalidUserId",
        statement_id: "invalidStatementId",
      };
      await getStatementOperationUseCase.execute(getStatementOperation);
    }).rejects.toBeInstanceOf(AppError);
  });
});