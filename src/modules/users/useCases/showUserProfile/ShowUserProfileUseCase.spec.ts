import { AppError } from "@src/shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("[Show user profile service]", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show an user profile", async () => {
    const newUser: ICreateUserDTO = {
      name: "User3",
      email: "user3@example.com",
      password: "userPassword",
    };
    const user: any = await createUserUseCase.execute(newUser);
    const result = await showUserProfileUseCase.execute(user.id);
    expect(result).toHaveProperty("id");
  });

  it("Should not be able to show a profile for an invalid user", async () => {
    expect(async () => {
      const invalidUser = {
        user_id: "invalidUserId",
      };
      await showUserProfileUseCase.execute(invalidUser.user_id);
    }).rejects.toHaveProperty('statusCode')
  });
});
