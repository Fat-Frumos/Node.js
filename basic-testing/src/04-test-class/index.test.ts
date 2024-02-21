import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError
} from '.';

describe('BankAccount', () => {
  
  let account = getBankAccount(0);
  let bankAccount = getBankAccount(200);
  
  beforeEach(() => {
    jest.restoreAllMocks();
    account = getBankAccount(100);
  });
  
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });
  
  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });
  
  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(150, bankAccount)).toThrow(InsufficientFundsError);
  });
  
  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(50, account)).toThrow(Error);
  });
  
  test('should deposit money', () => {
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });
  
  test('should withdraw money', () => {
    account.withdraw(50);
    expect(account.getBalance()).toBe(50);
  });
  
  test('should transfer money', () => {
    account.transfer(50, bankAccount);
    expect(account.getBalance()).toBe(50);
    expect(bankAccount.getBalance()).toBe(250);
  });
  
  test('should set new balance if fetchBalance returned number', async () => {
    const balance = account.getBalance();
    const newBalance = 42;
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(newBalance);
    await account.synchronizeBalance();
    const newBalanceAccount = account.getBalance();
    expect(newBalance).toBe(newBalanceAccount);
    expect(newBalanceAccount === balance).toBe(false);
  });
  
  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
  
  test('should set initial balance correctly', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });
  
  test('should deposit correctly', () => {
    const initialBalance = 100;
    const depositAmount = 50;
    const expectedBalance = initialBalance + depositAmount;
    const account = new BankAccount(initialBalance);
    account.deposit(depositAmount);
    expect(account.getBalance()).toBe(expectedBalance);
  });
  
  test('should withdraw correctly', () => {
    const initialBalance = 100;
    const withdrawalAmount = 50;
    const expectedBalance = initialBalance - withdrawalAmount;
    const account = new BankAccount(initialBalance);
    account.withdraw(withdrawalAmount);
    expect(account.getBalance()).toBe(expectedBalance);
  });
  
  test('should throw error for insufficient funds on withdrawal', () => {
    const initialBalance = 100;
    const withdrawalAmount = 150;
    const account = new BankAccount(initialBalance);
    expect(() => account.withdraw(withdrawalAmount)).toThrow(InsufficientFundsError);
  });
  
  test('should return balance asynchronously', async () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    const retrievedBalance = await new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(account.getBalance());
      }, 1000);
    });
    expect(retrievedBalance).toBe(initialBalance);
  });
});
