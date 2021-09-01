import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to get statement operation", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "deposit money"
    })

    const statement = await getStatementOperationUseCase.execute({ user_id: userCreated.id, statement_id: statementCreated.id });

    expect(statement).toEqual(statementCreated);
  });

  it("should not be able to get statement operation for non-existent user", async () => {
    let error: any;

    const userCreated = await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "deposit money"
    })

    try {
      await getStatementOperationUseCase.execute({ user_id: "non-existent user id", statement_id: statementCreated.id });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError('User not found', 404));
  });

  it("should not be able to get statement operation for non-existent statement", async () => {
    let error: any;

    const userCreated = await createUserUseCase.execute({
      name: "User Name",
      email: "user@mail.com",
      password: "password"
    });

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "deposit money"
    })

    try {
      await getStatementOperationUseCase.execute({ user_id: userCreated.id, statement_id: "non-existent statement" });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new AppError('Statement not found', 404));
  });
});
