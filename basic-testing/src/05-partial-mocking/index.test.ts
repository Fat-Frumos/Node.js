import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

let spyLog: jest.SpyInstance;

beforeEach(() => {
  spyLog = jest.spyOn(console, 'log');
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    expect(mockOne).not.toHaveBeenCalled();
    expect(spyLog).not.toBeCalled();
    expect(mockTwo).not.toHaveBeenCalled();
    expect(spyLog).not.toBeCalled();
    expect(mockThree).not.toHaveBeenCalled();
    expect(spyLog).not.toBeCalled();
  });

  test('unMockedFunction should log into console', () => {
    unmockedFunction();
    expect(spyLog).toBeCalledTimes(1);
  });
});
