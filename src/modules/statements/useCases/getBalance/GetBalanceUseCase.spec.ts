import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("should be able to get balance for user", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

   await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "deposit money"
    })

    await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: 'withdraw' as OperationType,
      amount: 100,
      description: "fun"
    })

    const balance = await getBalanceUseCase.execute({ user_id: userCreated.id });

    expect(balance.statement.length).toEqual(2);
    expect(balance.balance).toEqual(900);
  });

  it("should not be able to get balance for non-existent user", async () => {
    let error: any;

    try {
      await getBalanceUseCase.execute({ user_id: "non-existent user id" });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError('User not found', 404));
  });
});
