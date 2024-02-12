import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');
  
  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  const endpoint = '/users/1';
  
  beforeAll(() => {
    jest.useFakeTimers();
  });
  
  beforeEach(() => {
    jest.runOnlyPendingTimers();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    jest.useRealTimers();
  });
  
  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(baseUrl);
    expect(axiosCreateSpy).toHaveBeenCalledWith({ baseURL: baseUrl });
  });
  
  test('should perform request to correct provided url', async () => {
    const axiosGetSpy = jest.spyOn(axios.Axios.prototype, 'get');
    await throttledGetDataFromApi(endpoint);
    expect(axiosGetSpy).toHaveBeenCalledWith(endpoint);
  });
  
  test('should return response data', async () => {
    const responseData = {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      username: "Bret",
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
    };
    
    jest.spyOn(axios, 'get').mockResolvedValue({ data: responseData });
    const result = await throttledGetDataFromApi(endpoint);
    expect(result).toEqual(responseData);
  });

});
