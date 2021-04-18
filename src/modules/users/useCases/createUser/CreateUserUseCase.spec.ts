import { AppError } from "@src/shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("[Create a new user service]", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("Should be able to create a new user", async () => {
    const newUser: ICreateUserDTO = {
      name: "User1",
      email: "user1@example.com",
      password: "userPassword",
    };
    const result = await createUserUseCase.execute(newUser);
    expect(result).toHaveProperty("id");
  });
  it("Should not be able to create a new user with an email that already exists", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User",
        email: "user@example.com",
        password: "userPassword",
      };
      await createUserUseCase.execute(user);
      expect(async () => {
        const duplicateUser: ICreateUserDTO = {
          name: "User",
          email: "user@example.com",
          password: "userPassword",
        };
        await createUserUseCase.execute(duplicateUser);
      }).rejects.toBeInstanceOf(AppError);
    });
  });
});
