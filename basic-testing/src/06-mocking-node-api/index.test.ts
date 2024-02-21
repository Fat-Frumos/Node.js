import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import fs from 'fs';
import {join} from 'path';
import promisifiedFs from 'fs/promises';

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(() => Promise.resolve('content')),
  },
  existsSync: jest.fn()
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout - 1);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByInterval(callback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const numIntervals = 3;
    doStuffByInterval(callback, timeout);
    for (let i = 0; i < numIntervals; i++) {
      jest.advanceTimersByTime(timeout);
      expect(callback).toHaveBeenCalledTimes(i + 1);
    }
  });
});

describe('readFileAsynchronously', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should call join with pathToFile', async () => {
    const pathToFile = 'example.txt';
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'none.txt';
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(promisifiedFs, 'readFile').mockResolvedValue({ toString: () => '' } as Buffer);
    const content = await readFileAsynchronously('test.txt');
    expect(typeof content).toBe('string');
    });
});
