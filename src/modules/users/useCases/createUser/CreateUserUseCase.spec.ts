import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { Any } from "typeorm";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create user", async () => {
    const user = {
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    }

    const userCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(userCreated).toHaveProperty("id");
  });

  it("should not be able to create user with email already exist.", async () => {
    let error = Any;

    await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    try {
      await createUserUseCase.execute({
        name: "Another User",
        email: "user@mail.com",
        password: "password"
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError('User already exists'))
  });
});
