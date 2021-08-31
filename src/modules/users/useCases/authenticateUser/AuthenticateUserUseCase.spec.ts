import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: "user@mail.com",
      password: "password"
    });

    expect(userAuthenticated).toHaveProperty("token")
  });

  it("should not be able to authenticate user with incorrect email", async () => {
    let error: any;

    await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    try {
      await authenticateUserUseCase.execute({
        email: "incorrect_user@mail.com",
        password: "password"
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError("Incorrect email or password", 401));
  });

  it("should not be able to authenticate user with incorrect password", async () => {
    let error: any;

    await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    try {
      await authenticateUserUseCase.execute({
        email: "user@mail.com",
        password: "incorrect_password"
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError("Incorrect email or password", 401));
  });
});
