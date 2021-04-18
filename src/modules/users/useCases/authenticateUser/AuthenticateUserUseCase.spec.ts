import { AppError } from "@src/shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("[Authenticate user service]", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });
  it("Should be able to authenticate an user", async () => {
    const newUser: ICreateUserDTO = {
      name: "User2",
      email: "user2@example.com",
      password: "userPassword",
    };
    await createUserUseCase.execute(newUser);
    const result = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password,
    });
    expect(result).toHaveProperty("token");
  });
  it("Should not be able to authenticate an invalid user", async () => {
    expect(async () => {
      const invalidUser = {
        email: "invalidUser@example.com",
        password: "invalidUserPassword",
      };
      await authenticateUserUseCase.execute({
        email: invalidUser.email,
        password: invalidUser.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
