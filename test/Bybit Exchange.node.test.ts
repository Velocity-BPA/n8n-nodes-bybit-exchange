/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { BybitExchange } from '../nodes/Bybit Exchange/Bybit Exchange.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('BybitExchange Node', () => {
  let node: BybitExchange;

  beforeAll(() => {
    node = new BybitExchange();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Bybit Exchange');
      expect(node.description.name).toBe('bybitexchange');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Market Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.bybit.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  test('getInstruments operation should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getInstruments')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('');

    const mockResponse = {
      retCode: 0,
      retMsg: 'OK',
      result: { list: [] }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeMarketOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/v5/market/instruments-info'),
      })
    );
  });

  test('getOrderbook operation should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrderbook')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce(25);

    const mockResponse = {
      retCode: 0,
      retMsg: 'OK',
      result: { s: 'BTCUSDT', b: [], a: [] }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeMarketOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getInstruments');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeMarketOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getInstruments');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    const items = [{ json: {} }];

    await expect(executeMarketOperations.call(mockExecuteFunctions, items)).rejects.toThrow('API Error');
  });
});

describe('Trading Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api-testnet.bybit.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should create order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createOrder')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('Buy')
      .mockReturnValueOnce('Market')
      .mockReturnValueOnce('0.001')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('GTC')
      .mockReturnValueOnce('');

    const mockResponse = {
      retCode: 0,
      retMsg: 'OK',
      result: {
        orderId: '12345',
        orderLinkId: '',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTradingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api-testnet.bybit.com/v5/order/create',
      headers: {
        'X-BAPI-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        category: 'spot',
        symbol: 'BTCUSDT',
        side: 'Buy',
        orderType: 'Market',
        qty: '0.001',
        timeInForce: 'GTC',
      },
      json: true,
    });

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
  });

  it('should handle errors when creating order fails', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createOrder')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('Buy')
      .mockReturnValueOnce('Market')
      .mockReturnValueOnce('0.001');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error'),
    );
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTradingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([
      {
        json: { error: 'API Error' },
        pairedItem: { item: 0 },
      },
    ]);
  });

  it('should get active orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getActiveOrders')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce('');

    const mockResponse = {
      retCode: 0,
      retMsg: 'OK',
      result: {
        list: [],
        nextPageCursor: '',
        category: 'spot',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTradingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
  });

  it('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteOrder')
      .mockReturnValueOnce('spot')
      .mockReturnValueOnce('BTCUSDT')
      .mockReturnValueOnce('12345')
      .mockReturnValueOnce('');

    const mockResponse = {
      retCode: 0,
      retMsg: 'OK',
      result: {
        orderId: '12345',
        orderLinkId: '',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTradingOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api-testnet.bybit.com/v5/order/cancel',
      headers: {
        'X-BAPI-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        category: 'spot',
        symbol: 'BTCUSDT',
        orderId: '12345',
      },
      json: true,
    });

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
  });
});

describe('Position Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        baseUrl: 'https://api.bybit.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getPositions', () => {
    it('should get positions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPositions')
        .mockReturnValueOnce('linear')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        retCode: 0,
        result: { list: [{ symbol: 'BTCUSDT', size: '0.1' }] }
      });

      const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.retCode).toBe(0);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/v5/position/list'),
        })
      );
    });

    it('should handle errors in getPositions', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getPositions');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('setLeverage', () => {
    it('should set leverage successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('setLeverage')
        .mockReturnValueOnce('linear')
        .mockReturnValueOnce('BTCUSDT')
        .mockReturnValueOnce('10')
        .mockReturnValueOnce('10');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        retCode: 0,
        result: {}
      });

      const result = await executePositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.retCode).toBe(0);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/v5/position/set-leverage'),
        })
      );
    });
  });
});

describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				secretKey: 'test-secret-key',
				baseUrl: 'https://api-testnet.bybit.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get wallet balance successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getWalletBalance')
			.mockReturnValueOnce('UNIFIED')
			.mockReturnValueOnce('BTC');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			retCode: 0,
			retMsg: 'OK',
			result: {
				list: [{
					accountType: 'UNIFIED',
					accountLTV: '0',
					accountIMRate: '0',
					accountMMRate: '0',
					totalEquity: '1000.00',
				}],
			},
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.retCode).toBe(0);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/v5/account/wallet-balance'),
			})
		);
	});

	it('should upgrade to UTA successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('upgradeToUta');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			retCode: 0,
			retMsg: 'OK',
			result: {},
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.retCode).toBe(0);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining('/v5/account/upgrade-to-uta'),
			})
		);
	});

	it('should get borrow history successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBorrowHistory')
			.mockReturnValueOnce('USDT')
			.mockReturnValueOnce(1640995200000)
			.mockReturnValueOnce(1641081600000)
			.mockReturnValueOnce(20)
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			retCode: 0,
			retMsg: 'OK',
			result: {
				rows: [],
			},
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.retCode).toBe(0);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/v5/account/borrow-history'),
			})
		);
	});

	it('should set margin mode successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('setMarginMode')
			.mockReturnValueOnce('PORTFOLIO_MARGIN');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			retCode: 0,
			retMsg: 'OK',
			result: {},
		});

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.retCode).toBe(0);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining('/v5/account/set-margin-mode'),
				body: { setMarginMode: 'PORTFOLIO_MARGIN' },
			})
		);
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccountInfo');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccountInfo');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Asset Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api-testnet.bybit.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should get transfer info successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransferInfo');
		mockExecuteFunctions.helpers.httpRequest.mockResol

describe('User Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        testnet: false,
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should create sub member successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createSubMember')
      .mockReturnValueOnce('testuser')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('Test note');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      retCode: 0,
      retMsg: 'OK',
      result: { uid: '12345' },
    });

    const result = await executeUserOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.bybit.com/v5/user/create-sub-member',
      headers: expect.objectContaining({
        'X-BAPI-API-KEY': 'test-key',
      }),
      body: {
        username: 'testuser',
        memberType: 1,
        switch: 1,
        note: 'Test note',
      },
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json.retCode).toBe(0);
  });

  it('should get sub members successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getSubMembers');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      retCode: 0,
      retMsg: 'OK',
      result: { subMembers: [] },
    });

    const result = await executeUserOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.bybit.com/v5/user/query-sub-members',
      headers: expect.objectContaining({
        'X-BAPI-API-KEY': 'test-key',
      }),
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json.retCode).toBe(0);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getSubMembers');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error'),
    );

    const result = await executeUserOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getSubMembers');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error'),
    );

    await expect(
      executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('API Error');
  });
});
});
