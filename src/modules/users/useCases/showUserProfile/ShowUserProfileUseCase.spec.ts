import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user profile", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    const userShowProfile = await showUserProfileUseCase.execute(userCreated.id);

    expect(userShowProfile).toEqual(userCreated);
  });

  it("should not be able to show user profile with incorrect id", async () => {
    let error: any;

    await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    try {
      await showUserProfileUseCase.execute("incorrect id");
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError('User not found', 404));
  })
});
