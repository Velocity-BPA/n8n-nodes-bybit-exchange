/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-bybitexchange/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import crypto from 'crypto';
import { createHmac } from 'crypto';

export class BybitExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bybit Exchange',
    name: 'bybitexchange',
    icon: 'file:bybitexchange.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Bybit Exchange API',
    defaults: {
      name: 'Bybit Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bybitexchangeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Market',
            value: 'market',
          },
          {
            name: 'Trading',
            value: 'trading',
          },
          {
            name: 'Position',
            value: 'position',
          },
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Asset',
            value: 'asset',
          },
          {
            name: 'User',
            value: 'user',
          }
        ],
        default: 'market',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['market'] } },
  options: [
    { name: 'Get Instruments', value: 'getInstruments', description: 'Get instrument specifications', action: 'Get instruments' },
    { name: 'Get Orderbook', value: 'getOrderbook', description: 'Get orderbook data', action: 'Get orderbook' },
    { name: 'Get Klines', value: 'getKlines', description: 'Get candlestick data', action: 'Get klines' },
    { name: 'Get Tickers', value: 'getTickers', description: 'Get latest price ticker', action: 'Get tickers' },
    { name: 'Get Recent Trades', value: 'getRecentTrades', description: 'Get recent trades', action: 'Get recent trades' },
    { name: 'Get Insurance', value: 'getInsurance', description: 'Get insurance pool data', action: 'Get insurance' },
    { name: 'Get Server Time', value: 'getServerTime', description: 'Get server time', action: 'Get server time' },
  ],
  default: 'getInstruments',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['trading'] } },
  options: [
    { name: 'Create Order', value: 'createOrder', description: 'Place a new order', action: 'Create order' },
    { name: 'Update Order', value: 'updateOrder', description: 'Modify an existing order', action: 'Update order' },
    { name: 'Delete Order', value: 'deleteOrder', description: 'Cancel an order', action: 'Delete order' },
    { name: 'Cancel All Orders', value: 'cancelAllOrders', description: 'Cancel all orders', action: 'Cancel all orders' },
    { name: 'Get Active Orders', value: 'getActiveOrders', description: 'Get active orders', action: 'Get active orders' },
    { name: 'Get Order History', value: 'getOrderHistory', description: 'Get order history', action: 'Get order history' },
    { name: 'Create Batch Orders', value: 'createBatchOrders', description: 'Place multiple orders', action: 'Create batch orders' },
    { name: 'Update Batch Orders', value: 'updateBatchOrders', description: 'Modify multiple orders', action: 'Update batch orders' },
    { name: 'Delete Batch Orders', value: 'deleteBatchOrders', description: 'Cancel multiple orders', action: 'Delete batch orders' },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['position'] } },
  options: [
    {
      name: 'Get Positions',
      value: 'getPositions',
      description: 'Get position information',
      action: 'Get position information',
    },
    {
      name: 'Set Leverage',
      value: 'setLeverage',
      description: 'Set position leverage',
      action: 'Set position leverage',
    },
    {
      name: 'Switch Margin Mode',
      value: 'switchMarginMode',
      description: 'Switch between cross/isolated margin',
      action: 'Switch margin mode',
    },
    {
      name: 'Set TP/SL Mode',
      value: 'setTpSlMode',
      description: 'Set TP/SL mode',
      action: 'Set TP/SL mode',
    },
    {
      name: 'Switch Position Mode',
      value: 'switchPositionMode',
      description: 'Switch position mode',
      action: 'Switch position mode',
    },
    {
      name: 'Set Risk Limit',
      value: 'setRiskLimit',
      description: 'Set risk limit',
      action: 'Set risk limit',
    },
    {
      name: 'Set Trading Stop',
      value: 'setTradingStop',
      description: 'Set trading stop',
      action: 'Set trading stop',
    },
    {
      name: 'Get Executions',
      value: 'getExecutions',
      description: 'Get trade execution records',
      action: 'Get trade execution records',
    },
  ],
  default: 'getPositions',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['account'],
		},
	},
	options: [
		{
			name: 'Get Wallet Balance',
			value: 'getWalletBalance',
			description: 'Get wallet balance for account',
			action: 'Get wallet balance',
		},
		{
			name: 'Upgrade to UTA',
			value: 'upgradeToUta',
			description: 'Upgrade to Unified Trading Account',
			action: 'Upgrade to unified trading account',
		},
		{
			name: 'Get Borrow History',
			value: 'getBorrowHistory',
			description: 'Get borrow records',
			action: 'Get borrow history',
		},
		{
			name: 'Set Margin Mode',
			value: 'setMarginMode',
			description: 'Set margin mode',
			action: 'Set margin mode',
		},
		{
			name: 'Set Hedging Mode',
			value: 'setHedgingMode',
			description: 'Set hedging mode',
			action: 'Set hedging mode',
		},
		{
			name: 'Get Account Info',
			value: 'getAccountInfo',
			description: 'Get account information',
			action: 'Get account information',
		},
		{
			name: 'Get Transaction Log',
			value: 'getTransactionLog',
			description: 'Get transaction logs',
			action: 'Get transaction log',
		},
		{
			name: 'Get Contract Transaction Log',
			value: 'getContractTransactionLog',
			description: 'Get contract transaction logs',
			action: 'Get contract transaction log',
		},
		{
			name: 'Get SMP Group',
			value: 'getSmpGroup',
			description: 'Get SMP group info',
			action: 'Get SMP group info',
		},
		{
			name: 'Set Account Margin Mode',
			value: 'setAccountMarginMode',
			description: 'Set account margin mode',
			action: 'Set account margin mode',
		},
	],
	default: 'getWalletBalance',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['asset'],
		},
	},
	options: [
		{
			name: 'Get Transfer Info',
			value: 'getTransferInfo',
			description: 'Query transfer info',
			action: 'Get transfer info',
		},
		{
			name: 'Get Coin Balance',
			value: 'getCoinBalance',
			description: 'Get coin balance for account',
			action: 'Get coin balance',
		},
		{
			name: 'Get Single Coin Balance',
			value: 'getSingleCoinBalance',
			description: 'Get single coin balance for account',
			action: 'Get single coin balance',
		},
		{
			name: 'Create Internal Transfer',
			value: 'createInternalTransfer',
			description: 'Internal transfer between accounts',
			action: 'Create internal transfer',
		},
		{
			name: 'Get Internal Transfers',
			value: 'getInternalTransfers',
			description: 'Get internal transfer records',
			action: 'Get internal transfers',
		},
		{
			name: 'Get Sub Members',
			value: 'getSubMembers',
			description: 'Get sub member list',
			action: 'Get sub members',
		},
		{
			name: 'Create Universal Transfer',
			value: 'createUniversalTransfer',
			description: 'Universal transfer between members',
			action: 'Create universal transfer',
		},
		{
			name: 'Get Universal Transfers',
			value: 'getUniversalTransfers',
			description: 'Get universal transfer records',
			action: 'Get universal transfers',
		},
		{
			name: 'Get Coin Info',
			value: 'getCoinInfo',
			description: 'Get coin information',
			action: 'Get coin info',
		},
		{
			name: 'Get Deposit Records',
			value: 'getDepositRecords',
			description: 'Get deposit records',
			action: 'Get deposit records',
		},
		{
			name: 'Get Sub Member Deposit Records',
			value: 'getSubMemberDepositRecords',
			description: 'Get sub member deposit records',
			action: 'Get sub member deposit records',
		},
		{
			name: 'Get Internal Deposit Records',
			value: 'getInternalDepositRecords',
			description: 'Get internal deposit records',
			action: 'Get internal deposit records',
		},
		{
			name: 'Get Deposit Address',
			value: 'getDepositAddress',
			description: 'Get deposit address for coin',
			action: 'Get deposit address',
		},
		{
			name: 'Get Withdraw Records',
			value: 'getWithdrawRecords',
			description: 'Get withdrawal records',
			action: 'Get withdraw records',
		},
		{
			name: 'Create Withdrawal',
			value: 'createWithdrawal',
			description: 'Submit withdrawal request',
			action: 'Create withdrawal',
		},
		{
			name: 'Cancel Withdrawal',
			value: 'cancelWithdrawal',
			description: 'Cancel withdrawal request',
			action: 'Cancel withdrawal',
		},
	],
	default: 'getTransferInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['user'] } },
  options: [
    { name: 'Create Sub Member', value: 'createSubMember', description: 'Create a sub member account', action: 'Create sub member' },
    { name: 'Create Sub API Key', value: 'createSubApiKey', description: 'Create an API key for sub member', action: 'Create sub API key' },
    { name: 'Get Sub Members', value: 'getSubMembers', description: 'Get list of sub members', action: 'Get sub members' },
    { name: 'Freeze Sub Member', value: 'freezeSubMember', description: 'Freeze or unfreeze a sub member', action: 'Freeze sub member' },
    { name: 'Get API Key Info', value: 'getApiKeyInfo', description: 'Get API key information', action: 'Get API key information' },
    { name: 'Update Master API Key', value: 'updateMasterApiKey', description: 'Modify master API key settings', action: 'Update master API key' },
    { name: 'Update Sub API Key', value: 'updateSubApiKey', description: 'Modify sub API key settings', action: 'Update sub API key' },
    { name: 'Delete Sub API Key', value: 'deleteSubApiKey', description: 'Delete a sub API key', action: 'Delete sub API key' },
    { name: 'Delete Master API Key', value: 'deleteMasterApiKey', description: 'Delete master API key', action: 'Delete master API key' },
  ],
  default: 'createSubMember',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Option', value: 'option' },
  ],
  default: 'spot',
  displayOptions: { show: { resource: ['market'], operation: ['getInstruments'] } },
  description: 'Product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getInstruments'] } },
  description: 'Symbol name, like BTCUSDT',
},
{
  displayName: 'Base Coin',
  name: 'baseCoin',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getInstruments'] } },
  description: 'Base coin',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 500,
  displayOptions: { show: { resource: ['market'], operation: ['getInstruments'] } },
  description: 'Limit for data size per page',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getInstruments'] } },
  description: 'Cursor for pagination',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Option', value: 'option' },
  ],
  default: 'spot',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getOrderbook'] } },
  description: 'Product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getOrderbook'] } },
  description: 'Symbol name, like BTCUSDT',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 25,
  displayOptions: { show: { resource: ['market'], operation: ['getOrderbook'] } },
  description: 'Limit size for each bid and ask',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Option', value: 'option' },
  ],
  default: 'spot',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getKlines'] } },
  description: 'Product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getKlines'] } },
  description: 'Symbol name, like BTCUSDT',
},
{
  displayName: 'Interval',
  name: 'interval',
  type: 'options',
  options: [
    { name: '1 minute', value: '1' },
    { name: '3 minutes', value: '3' },
    { name: '5 minutes', value: '5' },
    { name: '15 minutes', value: '15' },
    { name: '30 minutes', value: '30' },
    { name: '1 hour', value: '60' },
    { name: '2 hours', value: '120' },
    { name: '4 hours', value: '240' },
    { name: '6 hours', value: '360' },
    { name: '12 hours', value: '720' },
    { name: '1 day', value: 'D' },
    { name: '1 week', value: 'W' },
    { name: '1 month', value: 'M' },
  ],
  default: '5',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getKlines'] } },
  description: 'Kline interval',
},
{
  displayName: 'Start Time',
  name: 'start',
  type: 'number',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getKlines'] } },
  description: 'The start timestamp (ms)',
},
{
  displayName: 'End Time',
  name: 'end',
  type: 'number',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getKlines'] } },
  description: 'The end timestamp (ms)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 200,
  displayOptions: { show: { resource: ['market'], operation: ['getKlines'] } },
  description: 'Limit for data size per page',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Option', value: 'option' },
  ],
  default: 'spot',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getTickers'] } },
  description: 'Product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getTickers'] } },
  description: 'Symbol name, like BTCUSDT',
},
{
  displayName: 'Base Coin',
  name: 'baseCoin',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getTickers'] } },
  description: 'Base coin',
},
{
  displayName: 'Expiry Date',
  name: 'expDate',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getTickers'] } },
  description: 'Expiry date for option',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Option', value: 'option' },
  ],
  default: 'spot',
  required: true,
  displayOptions: { show: { resource: ['market'], operation: ['getRecentTrades'] } },
  description: 'Product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getRecentTrades'] } },
  description: 'Symbol name, like BTCUSDT',
},
{
  displayName: 'Base Coin',
  name: 'baseCoin',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getRecentTrades'] } },
  description: 'Base coin',
},
{
  displayName: 'Option Type',
  name: 'optionType',
  type: 'options',
  options: [
    { name: 'Call', value: 'Call' },
    { name: 'Put', value: 'Put' },
  ],
  default: 'Call',
  displayOptions: { show: { resource: ['market'], operation: ['getRecentTrades'] } },
  description: 'Option type',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 500,
  displayOptions: { show: { resource: ['market'], operation: ['getRecentTrades'] } },
  description: 'Limit for data size per page',
},
{
  displayName: 'Coin',
  name: 'coin',
  type: 'string',
  default: '',
  displayOptions: { show: { resource: ['market'], operation: ['getInsurance'] } },
  description: 'Coin name',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder', 'deleteOrder', 'cancelAllOrders', 'getActiveOrders', 'getOrderHistory', 'createBatchOrders', 'updateBatchOrders', 'deleteBatchOrders'] } },
  options: [
    { name: 'Spot', value: 'spot' },
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Option', value: 'option' },
  ],
  default: 'spot',
  description: 'Product type',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder', 'deleteOrder'] } },
  default: '',
  placeholder: 'BTCUSDT',
  description: 'Symbol name',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
  options: [
    { name: 'Buy', value: 'Buy' },
    { name: 'Sell', value: 'Sell' },
  ],
  default: 'Buy',
  description: 'Order side',
},
{
  displayName: 'Order Type',
  name: 'orderType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
  options: [
    { name: 'Market', value: 'Market' },
    { name: 'Limit', value: 'Limit' },
  ],
  default: 'Market',
  description: 'Order type',
},
{
  displayName: 'Quantity',
  name: 'qty',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder'] } },
  default: '',
  description: 'Order quantity',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder'] } },
  default: '',
  description: 'Order price',
},
{
  displayName: 'Time in Force',
  name: 'timeInForce',
  type: 'options',
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder'] } },
  options: [
    { name: 'Good Till Cancel', value: 'GTC' },
    { name: 'Immediate or Cancel', value: 'IOC' },
    { name: 'Fill or Kill', value: 'FOK' },
    { name: 'Post Only', value: 'PostOnly' },
  ],
  default: 'GTC',
  description: 'Time in force',
},
{
  displayName: 'Order Link ID',
  name: 'orderLinkId',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['createOrder', 'updateOrder', 'deleteOrder'] } },
  default: '',
  description: 'User customised order ID',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['updateOrder', 'deleteOrder'] } },
  default: '',
  description: 'Order ID',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['cancelAllOrders', 'getActiveOrders', 'getOrderHistory'] } },
  default: '',
  description: 'Symbol name',
},
{
  displayName: 'Base Coin',
  name: 'baseCoin',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['cancelAllOrders', 'getActiveOrders', 'getOrderHistory'] } },
  default: '',
  description: 'Base coin',
},
{
  displayName: 'Settle Coin',
  name: 'settleCoin',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['cancelAllOrders'] } },
  default: '',
  description: 'Settle coin',
},
{
  displayName: 'Open Only',
  name: 'openOnly',
  type: 'number',
  displayOptions: { show: { resource: ['trading'], operation: ['getActiveOrders'] } },
  default: 0,
  description: '0(default): all orders. 1: active orders only',
},
{
  displayName: 'Order Filter',
  name: 'orderFilter',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['getActiveOrders', 'getOrderHistory'] } },
  default: '',
  description: 'Order, StopOrder, tpslOrder, OcoOrder, BidirectionalTpslOrder',
},
{
  displayName: 'Order Status',
  name: 'orderStatus',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['getOrderHistory'] } },
  default: '',
  description: 'Order status filter',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'number',
  displayOptions: { show: { resource: ['trading'], operation: ['getOrderHistory'] } },
  default: 0,
  description: 'Start timestamp',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'number',
  displayOptions: { show: { resource: ['trading'], operation: ['getOrderHistory'] } },
  default: 0,
  description: 'End timestamp',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['trading'], operation: ['getActiveOrders', 'getOrderHistory'] } },
  default: 20,
  description: 'Limit for data size per page',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  displayOptions: { show: { resource: ['trading'], operation: ['getActiveOrders', 'getOrderHistory'] } },
  default: '',
  description: 'Cursor for pagination',
},
{
  displayName: 'Request',
  name: 'request',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['trading'], operation: ['createBatchOrders', 'updateBatchOrders', 'deleteBatchOrders'] } },
  default: '[]',
  description: 'Array of order objects for batch operations',
},
{
  displayName: 'Category',
  name: 'category',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getPositions', 'setLeverage', 'switchMarginMode', 'setTpSlMode', 'switchPositionMode', 'setRiskLimit', 'setTradingStop', 'getExecutions'],
    },
  },
  options: [
    { name: 'Linear', value: 'linear' },
    { name: 'Inverse', value: 'inverse' },
    { name: 'Spot', value: 'spot' },
    { name: 'Option', value: 'option' },
  ],
  default: 'linear',
  description: 'Trading category',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getPositions', 'setLeverage', 'switchMarginMode', 'setTpSlMode', 'setRiskLimit', 'setTradingStop', 'getExecutions'],
    },
  },
  default: '',
  description: 'Symbol name',
},
{
  displayName: 'Base Coin',
  name: 'baseCoin',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getPositions', 'getExecutions'],
    },
  },
  default: '',
  description: 'Base coin',
},
{
  displayName: 'Settle Coin',
  name: 'settleCoin',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getPositions'],
    },
  },
  default: '',
  description: 'Settle coin',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getPositions', 'getExecutions'],
    },
  },
  default: 20,
  description: 'Number of records to return',
},
{
  displayName: 'Cursor',
  name: 'cursor',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getPositions', 'getExecutions'],
    },
  },
  default: '',
  description: 'Pagination cursor',
},
{
  displayName: 'Buy Leverage',
  name: 'buyLeverage',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setLeverage', 'switchMarginMode'],
    },
  },
  default: '',
  description: 'Buy leverage',
},
{
  displayName: 'Sell Leverage',
  name: 'sellLeverage',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setLeverage', 'switchMarginMode'],
    },
  },
  default: '',
  description: 'Sell leverage',
},
{
  displayName: 'Trade Mode',
  name: 'tradeMode',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['switchMarginMode'],
    },
  },
  options: [
    { name: 'Cross Margin', value: '0' },
    { name: 'Isolated Margin', value: '1' },
  ],
  default: '0',
  description: 'Trade mode',
},
{
  displayName: 'TP/SL Mode',
  name: 'tpSlMode',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setTpSlMode', 'setTradingStop'],
    },
  },
  options: [
    { name: 'Full', value: 'Full' },
    { name: 'Partial', value: 'Partial' },
  ],
  default: 'Full',
  description: 'TP/SL mode',
},
{
  displayName: 'Coin',
  name: 'coin',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['switchPositionMode'],
    },
  },
  default: '',
  description: 'Coin name',
},
{
  displayName: 'Mode',
  name: 'mode',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['switchPositionMode'],
    },
  },
  options: [
    { name: 'One Way Mode', value: '0' },
    { name: 'Hedge Mode', value: '3' },
  ],
  default: '0',
  description: 'Position mode',
},
{
  displayName: 'Risk ID',
  name: 'riskId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setRiskLimit'],
    },
  },
  default: 1,
  description: 'Risk limit ID',
},
{
  displayName: 'Position Index',
  name: 'positionIdx',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setRiskLimit', 'setTradingStop'],
    },
  },
  options: [
    { name: 'One Way Mode', value: '0' },
    { name: 'Buy Side (Hedge)', value: '1' },
    { name: 'Sell Side (Hedge)', value: '2' },
  ],
  default: '0',
  description: 'Position index',
},
{
  displayName: 'Take Profit',
  name: 'takeProfit',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setTradingStop'],
    },
  },
  default: '',
  description: 'Take profit price',
},
{
  displayName: 'Stop Loss',
  name: 'stopLoss',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setTradingStop'],
    },
  },
  default: '',
  description: 'Stop loss price',
},
{
  displayName: 'Trailing Stop',
  name: 'trailing',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['setTradingStop'],
    },
  },
  default: '',
  description: 'Trailing stop distance',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getExecutions'],
    },
  },
  default: '',
  description: 'Order ID',
},
{
  displayName: 'Order Link ID',
  name: 'orderLinkId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getExecutions'],
    },
  },
  default: '',
  description: 'User customized order ID',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getExecutions'],
    },
  },
  default: 0,
  description: 'Start timestamp',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getExecutions'],
    },
  },
  default: 0,
  description: 'End timestamp',
},
{
  displayName: 'Execution Type',
  name: 'execType',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['position'],
      operation: ['getExecutions'],
    },
  },
  options: [
    { name: 'Trade', value: 'Trade' },
    { name: 'AdlTrade', value: 'AdlTrade' },
    { name: 'Funding', value: 'Funding' },
    { name: 'BustTrade', value: 'BustTrade' },
  ],
  default: 'Trade',
  description: 'Execution type',
},
{
	displayName: 'Account Type',
	name: 'accountType',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getWalletBalance', 'getTransactionLog'],
		},
	},
	options: [
		{ name: 'Unified', value: 'UNIFIED' },
		{ name: 'Spot', value: 'SPOT' },
		{ name: 'Contract', value: 'CONTRACT' },
		{ name: 'Investment', value: 'INVESTMENT' },
		{ name: 'Option', value: 'OPTION' },
		{ name: 'Fund', value: 'FUND' },
	],
	default: 'UNIFIED',
	description: 'Account type to query',
},
{
	displayName: 'Coin',
	name: 'coin',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getWalletBalance', 'getContractTransactionLog'],
		},
	},
	default: '',
	description: 'Coin symbol (optional)',
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBorrowHistory', 'getTransactionLog'],
		},
	},
	default: '',
	description: 'Currency symbol',
},
{
	displayName: 'Start Time',
	name: 'startTime',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBorrowHistory', 'getTransactionLog', 'getContractTransactionLog'],
		},
	},
	default: 0,
	description: 'Start timestamp in milliseconds',
},
{
	displayName: 'End Time',
	name: 'endTime',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBorrowHistory', 'getTransactionLog', 'getContractTransactionLog'],
		},
	},
	default: 0,
	description: 'End timestamp in milliseconds',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBorrowHistory', 'getTransactionLog', 'getContractTransactionLog'],
		},
	},
	default: 20,
	description: 'Limit for data size per page. Max size is 50',
},
{
	displayName: 'Cursor',
	name: 'cursor',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBorrowHistory', 'getTransactionLog', 'getContractTransactionLog'],
		},
	},
	default: '',
	description: 'Cursor for pagination',
},
{
	displayName: 'Margin Mode',
	name: 'setMarginMode',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['setMarginMode', 'setAccountMarginMode'],
		},
	},
	options: [
		{ name: 'Regular Margin', value: 'REGULAR_MARGIN' },
		{ name: 'Portfolio Margin', value: 'PORTFOLIO_MARGIN' },
	],
	default: 'REGULAR_MARGIN',
	description: 'Margin mode to set',
},
{
	displayName: 'Hedging Mode',
	name: 'setHedgingMode',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['setHedgingMode'],
		},
	},
	options: [
		{ name: 'One-Way Mode', value: '0' },
		{ name: 'Hedge Mode', value: '1' },
	],
	default: '0',
	description: 'Position mode. 0: one-way mode, 1: hedge-mode',
},
{
	displayName: 'Category',
	name: 'category',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getTransactionLog'],
		},
	},
	options: [
		{ name: 'Spot', value: 'spot' },
		{ name: 'Linear', value: 'linear' },
		{ name: 'Inverse', value: 'inverse' },
		{ name: 'Option', value: 'option' },
	],
	default: 'spot',
	description: 'Product category',
},
{
	displayName: 'Base Coin',
	name: 'baseCoin',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getTransactionLog'],
		},
	},
	default: '',
	description: 'Base coin (for derivatives)',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getTransactionLog', 'getContractTransactionLog'],
		},
	},
	default: '',
	description: 'Transaction type',
},
{
	displayName: 'Account Type',
	name: 'accountType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getCoinBalance', 'getSingleCoinBalance'],
		},
	},
	default: '',
	description: 'Account type',
},
{
	displayName: 'Coin',
	name: 'coin',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getCoinBalance', 'getSingleCoinBalance', 'createInternalTransfer', 'getInternalTransfers', 'createUniversalTransfer', 'getUniversalTransfers', 'getCoinInfo', 'getDepositRecords', 'getSubMemberDepositRecords', 'getInternalDepositRecords', 'getDepositAddress', 'getWithdrawRecords', 'createWithdrawal'],
		},
	},
	default: '',
	description: 'Coin symbol',
},
{
	displayName: 'Transfer ID',
	name: 'transferId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createInternalTransfer', 'getInternalTransfers', 'createUniversalTransfer', 'getUniversalTransfers'],
		},
	},
	default: '',
	description: 'Transfer ID',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createInternalTransfer', 'createUniversalTransfer', 'createWithdrawal'],
		},
	},
	default: '',
	description: 'Transfer amount',
},
{
	displayName: 'From Account Type',
	name: 'fromAccountType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createInternalTransfer', 'createUniversalTransfer'],
		},
	},
	default: '',
	description: 'From account type',
},
{
	displayName: 'To Account Type',
	name: 'toAccountType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createInternalTransfer', 'createUniversalTransfer'],
		},
	},
	default: '',
	description: 'To account type',
},
{
	displayName: 'From Member ID',
	name: 'fromMemberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createUniversalTransfer'],
		},
	},
	default: '',
	description: 'From member ID',
},
{
	displayName: 'To Member ID',
	name: 'toMemberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createUniversalTransfer'],
		},
	},
	default: '',
	description: 'To member ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getInternalTransfers', 'getUniversalTransfers'],
		},
	},
	default: '',
	description: 'Transfer status',
},
{
	displayName: 'Start Time',
	name: 'startTime',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getInternalTransfers', 'getUniversalTransfers', 'getDepositRecords', 'getSubMemberDepositRecords', 'getInternalDepositRecords', 'getWithdrawRecords'],
		},
	},
	default: 0,
	description: 'Start time timestamp',
},
{
	displayName: 'End Time',
	name: 'endTime',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getInternalTransfers', 'getUniversalTransfers', 'getDepositRecords', 'getSubMemberDepositRecords', 'getInternalDepositRecords', 'getWithdrawRecords'],
		},
	},
	default: 0,
	description: 'End time timestamp',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getInternalTransfers', 'getUniversalTransfers', 'getDepositRecords', 'getSubMemberDepositRecords', 'getInternalDepositRecords', 'getWithdrawRecords'],
		},
	},
	default: 20,
	description: 'Number of records to return',
},
{
	displayName: 'Cursor',
	name: 'cursor',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getInternalTransfers', 'getUniversalTransfers', 'getDepositRecords', 'getSubMemberDepositRecords', 'getInternalDepositRecords', 'getWithdrawRecords'],
		},
	},
	default: '',
	description: 'Pagination cursor',
},
{
	displayName: 'Sub Member ID',
	name: 'subMemberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getSubMemberDepositRecords'],
		},
	},
	default: '',
	description: 'Sub member ID',
},
{
	displayName: 'TX ID',
	name: 'txID',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getInternalDepositRecords'],
		},
	},
	default: '',
	description: 'Transaction ID',
},
{
	displayName: 'Chain Type',
	name: 'chainType',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getDepositAddress'],
		},
	},
	default: '',
	description: 'Chain type',
},
{
	displayName: 'Withdraw ID',
	name: 'withdrawID',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getWithdrawRecords'],
		},
	},
	default: '',
	description: 'Withdrawal ID',
},
{
	displayName: 'Withdraw Type',
	name: 'withdrawType',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['getWithdrawRecords'],
		},
	},
	default: '',
	description: 'Withdrawal type',
},
{
	displayName: 'Chain',
	name: 'chain',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: '',
	description: 'Chain for withdrawal',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: '',
	description: 'Withdrawal address',
},
{
	displayName: 'Tag',
	name: 'tag',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: '',
	description: 'Address tag',
},
{
	displayName: 'Timestamp',
	name: 'timestamp',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: 0,
	description: 'Timestamp',
},
{
	displayName: 'Force Chain',
	name: 'forceChain',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: false,
	description: 'Force chain',
},
{
	displayName: 'Account Type',
	name: 'accountType',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: '',
	description: 'Account type for withdrawal',
},
{
	displayName: 'Fee Type',
	name: 'feeType',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['createWithdrawal'],
		},
	},
	default: '',
	description: 'Fee type',
},
{
	displayName: 'ID',
	name: 'id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['asset'],
			operation: ['cancelWithdrawal'],
		},
	},
	default: '',
	description: 'Withdrawal ID to cancel',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubMember'],
    },
  },
  default: '',
  description: 'Username for the sub member',
},
{
  displayName: 'Member Type',
  name: 'memberType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubMember'],
    },
  },
  options: [
    { name: '1 (Normal)', value: '1' },
    { name: '6 (Custodial)', value: '6' },
  ],
  default: '1',
  description: 'Type of sub member account',
},
{
  displayName: 'Switch',
  name: 'switch',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubMember'],
    },
  },
  options: [
    { name: '0 (Classic)', value: '0' },
    { name: '1 (UTA)', value: '1' },
  ],
  default: '1',
  description: 'Account mode switch',
},
{
  displayName: 'Note',
  name: 'note',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubMember', 'createSubApiKey'],
    },
  },
  default: '',
  description: 'Note for the sub member or API key',
},
{
  displayName: 'Sub UID',
  name: 'subuid',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubApiKey', 'freezeSubMember', 'updateSubApiKey', 'deleteSubApiKey'],
    },
  },
  default: '',
  description: 'Sub member UID',
},
{
  displayName: 'Read Only',
  name: 'readOnly',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubApiKey', 'updateMasterApiKey', 'updateSubApiKey'],
    },
  },
  options: [
    { name: '0 (Read and Write)', value: '0' },
    { name: '1 (Read Only)', value: '1' },
  ],
  default: '0',
  description: 'API key permissions',
},
{
  displayName: 'IPs',
  name: 'ips',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubApiKey', 'updateMasterApiKey', 'updateSubApiKey'],
    },
  },
  default: '',
  description: 'Comma-separated list of IP addresses',
},
{
  displayName: 'Permissions',
  name: 'permissions',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['createSubApiKey', 'updateMasterApiKey', 'updateSubApiKey'],
    },
  },
  default: '',
  description: 'Comma-separated list of permissions',
},
{
  displayName: 'Frozen',
  name: 'frozen',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['freezeSubMember'],
    },
  },
  options: [
    { name: '0 (Unfreeze)', value: '0' },
    { name: '1 (Freeze)', value: '1' },
  ],
  default: '1',
  description: 'Freeze status',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'market':
        return [await executeMarketOperations.call(this, items)];
      case 'trading':
        return [await executeTradingOperations.call(this, items)];
      case 'position':
        return [await executePositionOperations.call(this, items)];
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'asset':
        return [await executeAssetOperations.call(this, items)];
      case 'user':
        return [await executeUserOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeMarketOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bybitexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getInstruments': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const baseCoin = this.getNodeParameter('baseCoin', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          const params = new URLSearchParams();
          params.append('category', category);
          if (symbol) params.append('symbol', symbol);
          if (baseCoin) params.append('baseCoin', baseCoin);
          if (limit) params.append('limit', limit.toString());
          if (cursor) params.append('cursor', cursor);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/instruments-info?${params.toString()}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrderbook': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const params = new URLSearchParams();
          params.append('category', category);
          params.append('symbol', symbol);
          if (limit) params.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/orderbook?${params.toString()}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getKlines': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const interval = this.getNodeParameter('interval', i) as string;
          const start = this.getNodeParameter('start', i) as number;
          const end = this.getNodeParameter('end', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const params = new URLSearchParams();
          params.append('category', category);
          params.append('symbol', symbol);
          params.append('interval', interval);
          if (start) params.append('start', start.toString());
          if (end) params.append('end', end.toString());
          if (limit) params.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/kline?${params.toString()}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTickers': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const baseCoin = this.getNodeParameter('baseCoin', i) as string;
          const expDate = this.getNodeParameter('expDate', i) as string;

          const params = new URLSearchParams();
          params.append('category', category);
          if (symbol) params.append('symbol', symbol);
          if (baseCoin) params.append('baseCoin', baseCoin);
          if (expDate) params.append('expDate', expDate);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/tickers?${params.toString()}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRecentTrades': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const baseCoin = this.getNodeParameter('baseCoin', i) as string;
          const optionType = this.getNodeParameter('optionType', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const params = new URLSearchParams();
          params.append('category', category);
          if (symbol) params.append('symbol', symbol);
          if (baseCoin) params.append('baseCoin', baseCoin);
          if (optionType) params.append('optionType', optionType);
          if (limit) params.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/recent-trade?${params.toString()}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInsurance': {
          const coin = this.getNodeParameter('coin', i) as string;

          const params = new URLSearchParams();
          if (coin) params.append('coin', coin);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/insurance?${params.toString()}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getServerTime': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/market/time`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTradingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bybitexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createOrder': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const orderType = this.getNodeParameter('orderType', i) as string;
          const qty = this.getNodeParameter('qty', i) as string;
          const price = this.getNodeParameter('price', i) as string;
          const timeInForce = this.getNodeParameter('timeInForce', i) as string;
          const orderLinkId = this.getNodeParameter('orderLinkId', i) as string;

          const body: any = {
            category,
            symbol,
            side,
            orderType,
            qty,
          };

          if (price) body.price = price;
          if (timeInForce) body.timeInForce = timeInForce;
          if (orderLinkId) body.orderLinkId = orderLinkId;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/create',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrder': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          const orderLinkId = this.getNodeParameter('orderLinkId', i) as string;
          const qty = this.getNodeParameter('qty', i) as string;
          const price = this.getNodeParameter('price', i) as string;

          const body: any = {
            category,
            symbol,
          };

          if (orderId) body.orderId = orderId;
          if (orderLinkId) body.orderLinkId = orderLinkId;
          if (qty) body.qty = qty;
          if (price) body.price = price;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/amend',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteOrder': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          const orderLinkId = this.getNodeParameter('orderLinkId', i) as string;

          const body: any = {
            category,
            symbol,
          };

          if (orderId) body.orderId = orderId;
          if (orderLinkId) body.orderLinkId = orderLinkId;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/cancel',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelAllOrders': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const baseCoin = this.getNodeParameter('baseCoin', i) as string;
          const settleCoin = this.getNodeParameter('settleCoin', i) as string;

          const body: any = {
            category,
          };

          if (symbol) body.symbol = symbol;
          if (baseCoin) body.baseCoin = baseCoin;
          if (settleCoin) body.settleCoin = settleCoin;

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/cancel-all',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActiveOrders': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const baseCoin = this.getNodeParameter('baseCoin', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          const orderLinkId = this.getNodeParameter('orderLinkId', i) as string;
          const openOnly = this.getNodeParameter('openOnly', i) as number;
          const orderFilter = this.getNodeParameter('orderFilter', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          const params = new URLSearchParams();
          params.append('category', category);
          if (symbol) params.append('symbol', symbol);
          if (baseCoin) params.append('baseCoin', baseCoin);
          if (orderId) params.append('orderId', orderId);
          if (orderLinkId) params.append('orderLinkId', orderLinkId);
          if (openOnly) params.append('openOnly', openOnly.toString());
          if (orderFilter) params.append('orderFilter', orderFilter);
          if (limit) params.append('limit', limit.toString());
          if (cursor) params.append('cursor', cursor);

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + '/v5/order/realtime?' + params.toString(),
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrderHistory': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const baseCoin = this.getNodeParameter('baseCoin', i) as string;
          const orderId = this.getNodeParameter('orderId', i) as string;
          const orderLinkId = this.getNodeParameter('orderLinkId', i) as string;
          const orderStatus = this.getNodeParameter('orderStatus', i) as string;
          const orderFilter = this.getNodeParameter('orderFilter', i) as string;
          const startTime = this.getNodeParameter('startTime', i) as number;
          const endTime = this.getNodeParameter('endTime', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;

          const params = new URLSearchParams();
          params.append('category', category);
          if (symbol) params.append('symbol', symbol);
          if (baseCoin) params.append('baseCoin', baseCoin);
          if (orderId) params.append('orderId', orderId);
          if (orderLinkId) params.append('orderLinkId', orderLinkId);
          if (orderStatus) params.append('orderStatus', orderStatus);
          if (orderFilter) params.append('orderFilter', orderFilter);
          if (startTime) params.append('startTime', startTime.toString());
          if (endTime) params.append('endTime', endTime.toString());
          if (limit) params.append('limit', limit.toString());
          if (cursor) params.append('cursor', cursor);

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + '/v5/order/history?' + params.toString(),
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createBatchOrders': {
          const category = this.getNodeParameter('category', i) as string;
          const request = this.getNodeParameter('request', i) as any[];

          const body: any = {
            category,
            request,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/create-batch',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateBatchOrders': {
          const category = this.getNodeParameter('category', i) as string;
          const request = this.getNodeParameter('request', i) as any[];

          const body: any = {
            category,
            request,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/amend-batch',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteBatchOrders': {
          const category = this.getNodeParameter('category', i) as string;
          const request = this.getNodeParameter('request', i) as any[];

          const body: any = {
            category,
            request,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/v5/order/cancel-batch',
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePositionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bybitexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      const recvWindow = '5000';

      switch (operation) {
        case 'getPositions': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i, '') as string;
          const baseCoin = this.getNodeParameter('baseCoin', i, '') as string;
          const settleCoin = this.getNodeParameter('settleCoin', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const cursor = this.getNodeParameter('cursor', i, '') as string;

          const params: any = { category };
          if (symbol) params.symbol = symbol;
          if (baseCoin) params.baseCoin = baseCoin;
          if (settleCoin) params.settleCoin = settleCoin;
          if (limit) params.limit = limit;
          if (cursor) params.cursor = cursor;

          const queryString = new URLSearchParams(params).toString();
          const signPayload = timestamp + credentials.apiKey + recvWindow + queryString;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/position/list?${queryString}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'setLeverage': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const buyLeverage = this.getNodeParameter('buyLeverage', i) as string;
          const sellLeverage = this.getNodeParameter('sellLeverage', i) as string;

          const body = JSON.stringify({ category, symbol, buyLeverage, sellLeverage });
          const signPayload = timestamp + credentials.apiKey + recvWindow + body;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v5/position/set-leverage`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'switchMarginMode': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const tradeMode = this.getNodeParameter('tradeMode', i) as string;
          const buyLeverage = this.getNodeParameter('buyLeverage', i) as string;
          const sellLeverage = this.getNodeParameter('sellLeverage', i) as string;

          const body = JSON.stringify({ category, symbol, tradeMode, buyLeverage, sellLeverage });
          const signPayload = timestamp + credentials.apiKey + recvWindow + body;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v5/position/switch-isolated`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'setTpSlMode': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const tpSlMode = this.getNodeParameter('tpSlMode', i) as string;

          const body = JSON.stringify({ category, symbol, tpSlMode });
          const signPayload = timestamp + credentials.apiKey + recvWindow + body;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v5/position/set-tpsl-mode`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'switchPositionMode': {
          const category = this.getNodeParameter('category', i) as string;
          const coin = this.getNodeParameter('coin', i) as string;
          const mode = this.getNodeParameter('mode', i) as string;

          const body = JSON.stringify({ category, coin, mode });
          const signPayload = timestamp + credentials.apiKey + recvWindow + body;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v5/position/switch-mode`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'setRiskLimit': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const riskId = this.getNodeParameter('riskId', i) as number;
          const positionIdx = this.getNodeParameter('positionIdx', i, '0') as string;

          const body = JSON.stringify({ category, symbol, riskId, positionIdx });
          const signPayload = timestamp + credentials.apiKey + recvWindow + body;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v5/position/set-risk-limit`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'setTradingStop': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const takeProfit = this.getNodeParameter('takeProfit', i, '') as string;
          const stopLoss = this.getNodeParameter('stopLoss', i, '') as string;
          const trailing = this.getNodeParameter('trailing', i, '') as string;
          const tpslMode = this.getNodeParameter('tpSlMode', i, '') as string;
          const positionIdx = this.getNodeParameter('positionIdx', i, '0') as string;

          const requestBody: any = { category, symbol };
          if (takeProfit) requestBody.takeProfit = takeProfit;
          if (stopLoss) requestBody.stopLoss = stopLoss;
          if (trailing) requestBody.trailing = trailing;
          if (tpslMode) requestBody.tpslMode = tpslMode;
          if (positionIdx) requestBody.positionIdx = positionIdx;

          const body = JSON.stringify(requestBody);
          const signPayload = timestamp + credentials.apiKey + recvWindow + body;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/v5/position/trading-stop`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getExecutions': {
          const category = this.getNodeParameter('category', i) as string;
          const symbol = this.getNodeParameter('symbol', i, '') as string;
          const orderId = this.getNodeParameter('orderId', i, '') as string;
          const orderLinkId = this.getNodeParameter('orderLinkId', i, '') as string;
          const baseCoin = this.getNodeParameter('baseCoin', i, '') as string;
          const startTime = this.getNodeParameter('startTime', i, 0) as number;
          const endTime = this.getNodeParameter('endTime', i, 0) as number;
          const execType = this.getNodeParameter('execType', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const cursor = this.getNodeParameter('cursor', i, '') as string;

          const params: any = { category };
          if (symbol) params.symbol = symbol;
          if (orderId) params.orderId = orderId;
          if (orderLinkId) params.orderLinkId = orderLinkId;
          if (baseCoin) params.baseCoin = baseCoin;
          if (startTime) params.startTime = startTime;
          if (endTime) params.endTime = endTime;
          if (execType) params.execType = execType;
          if (limit) params.limit = limit;
          if (cursor) params.cursor = cursor;

          const queryString = new URLSearchParams(params).toString();
          const signPayload = timestamp + credentials.apiKey + recvWindow + queryString;
          const signature = crypto.createHmac('sha256', credentials.apiSecret).update(signPayload).digest('hex');

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/v5/execution/list?${queryString}`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-SIGN': signature,
              'X-BAPI-SIGN-TYPE': '2',
              'X-BAPI-TIMESTAMP': timestamp,
              'X-BAPI-RECV-WINDOW': recvWindow,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAccountOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bybitexchangeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const timestamp = Date.now().toString();
			const recvWindow = '5000';

			switch (operation) {
				case 'getWalletBalance': {
					const accountType = this.getNodeParameter('accountType', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					
					let queryString = `accountType=${accountType}`;
					if (coin) queryString += `&coin=${coin}`;
					
					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + queryString)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v5/account/wallet-balance?${queryString}`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'upgradeToUta': {
					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow)
						.digest('hex');

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v5/account/upgrade-to-uta`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getBorrowHistory': {
					const currency = this.getNodeParameter('currency', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					let queryString = '';
					const params: string[] = [];
					if (currency) params.push(`currency=${currency}`);
					if (startTime) params.push(`startTime=${startTime}`);
					if (endTime) params.push(`endTime=${endTime}`);
					if (limit) params.push(`limit=${limit}`);
					if (cursor) params.push(`cursor=${cursor}`);
					if (params.length > 0) queryString = params.join('&');

					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + queryString)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v5/account/borrow-history${queryString ? `?${queryString}` : ''}`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'setMarginMode': {
					const setMarginMode = this.getNodeParameter('setMarginMode', i) as string;
					const body = { setMarginMode };
					const bodyString = JSON.stringify(body);

					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + bodyString)
						.digest('hex');

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v5/account/set-margin-mode`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
							'Content-Type': 'application/json',
						},
						json: true,
						body: body,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'setHedgingMode': {
					const setHedgingMode = this.getNodeParameter('setHedgingMode', i) as string;
					const body = { setHedgingMode };
					const bodyString = JSON.stringify(body);

					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + bodyString)
						.digest('hex');

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v5/account/set-hedging-mode`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
							'Content-Type': 'application/json',
						},
						json: true,
						body: body,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getAccountInfo': {
					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v5/account/info`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTransactionLog': {
					const accountType = this.getNodeParameter('accountType', i) as string;
					const category = this.getNodeParameter('category', i) as string;
					const currency = this.getNodeParameter('currency', i) as string;
					const baseCoin = this.getNodeParameter('baseCoin', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: string[] = [];
					if (accountType) params.push(`accountType=${accountType}`);
					if (category) params.push(`category=${category}`);
					if (currency) params.push(`currency=${currency}`);
					if (baseCoin) params.push(`baseCoin=${baseCoin}`);
					if (type) params.push(`type=${type}`);
					if (startTime) params.push(`startTime=${startTime}`);
					if (endTime) params.push(`endTime=${endTime}`);
					if (limit) params.push(`limit=${limit}`);
					if (cursor) params.push(`cursor=${cursor}`);
					const queryString = params.join('&');

					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + queryString)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v5/account/transaction-log${queryString ? `?${queryString}` : ''}`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getContractTransactionLog': {
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const type = this.getNodeParameter('type', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: string[] = [];
					if (startTime) params.push(`startTime=${startTime}`);
					if (endTime) params.push(`endTime=${endTime}`);
					if (type) params.push(`type=${type}`);
					if (coin) params.push(`coin=${coin}`);
					if (limit) params.push(`limit=${limit}`);
					if (cursor) params.push(`cursor=${cursor}`);
					const queryString = params.join('&');

					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + queryString)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v5/account/contract-transaction-log${queryString ? `?${queryString}` : ''}`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getSmpGroup': {
					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow)
						.digest('hex');

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/v5/account/smp-group`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'setAccountMarginMode': {
					const setMarginMode = this.getNodeParameter('setMarginMode', i) as string;
					const body = { setMarginMode };
					const bodyString = JSON.stringify(body);

					const signature = createHmac('sha256', credentials.secretKey)
						.update(timestamp + credentials.apiKey + recvWindow + bodyString)
						.digest('hex');

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/v5/account/set-margin-mode`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'X-BAPI-SIGN': signature,
							'X-BAPI-SIGN-TYPE': '2',
							'X-BAPI-TIMESTAMP': timestamp,
							'X-BAPI-RECV-WINDOW': recvWindow,
							'Content-Type': 'application/json',
						},
						json: true,
						body: body,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAssetOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('bybitexchangeApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const baseUrl = credentials.baseUrl || 'https://api.bybit.com';

			switch (operation) {
				case 'getTransferInfo': {
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/transfer/query-info`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCoinBalance': {
					const accountType = this.getNodeParameter('accountType', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const params: any = { accountType };
					if (coin) params.coin = coin;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/transfer/query-account-coins-balance`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSingleCoinBalance': {
					const accountType = this.getNodeParameter('accountType', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const params: any = { accountType, coin };

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/transfer/query-account-coin-balance`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createInternalTransfer': {
					const transferId = this.getNodeParameter('transferId', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const fromAccountType = this.getNodeParameter('fromAccountType', i) as string;
					const toAccountType = this.getNodeParameter('toAccountType', i) as string;

					const body: any = {
						coin,
						amount,
						fromAccountType,
						toAccountType,
					};
					if (transferId) body.transferId = transferId;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/v5/asset/transfer/inter-transfer`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInternalTransfers': {
					const transferId = this.getNodeParameter('transferId', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: any = {};
					if (transferId) params.transferId = transferId;
					if (coin) params.coin = coin;
					if (status) params.status = status;
					if (startTime) params.startTime = startTime;
					if (endTime) params.endTime = endTime;
					if (limit) params.limit = limit;
					if (cursor) params.cursor = cursor;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/transfer/query-inter-transfer-list`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSubMembers': {
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/transfer/query-sub-member-list`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createUniversalTransfer': {
					const transferId = this.getNodeParameter('transferId', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const fromMemberId = this.getNodeParameter('fromMemberId', i) as string;
					const toMemberId = this.getNodeParameter('toMemberId', i) as string;
					const fromAccountType = this.getNodeParameter('fromAccountType', i) as string;
					const toAccountType = this.getNodeParameter('toAccountType', i) as string;

					const body: any = {
						coin,
						amount,
						fromMemberId,
						toMemberId,
						fromAccountType,
						toAccountType,
					};
					if (transferId) body.transferId = transferId;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/v5/asset/transfer/universal-transfer`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUniversalTransfers': {
					const transferId = this.getNodeParameter('transferId', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: any = {};
					if (transferId) params.transferId = transferId;
					if (coin) params.coin = coin;
					if (status) params.status = status;
					if (startTime) params.startTime = startTime;
					if (endTime) params.endTime = endTime;
					if (limit) params.limit = limit;
					if (cursor) params.cursor = cursor;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/transfer/query-universal-transfer-list`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCoinInfo': {
					const coin = this.getNodeParameter('coin', i) as string;
					const params: any = {};
					if (coin) params.coin = coin;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/coin/query-info`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDepositRecords': {
					const coin = this.getNodeParameter('coin', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: any = {};
					if (coin) params.coin = coin;
					if (startTime) params.startTime = startTime;
					if (endTime) params.endTime = endTime;
					if (limit) params.limit = limit;
					if (cursor) params.cursor = cursor;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/deposit/query-record`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSubMemberDepositRecords': {
					const subMemberId = this.getNodeParameter('subMemberId', i) as string;
					const coin = this.getNodeParameter('coin', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: any = { subMemberId };
					if (coin) params.coin = coin;
					if (startTime) params.startTime = startTime;
					if (endTime) params.endTime = endTime;
					if (limit) params.limit = limit;
					if (cursor) params.cursor = cursor;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/deposit/query-sub-member-record`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInternalDepositRecords': {
					const txID = this.getNodeParameter('txID', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const coin = this.getNodeParameter('coin', i) as string;
					const cursor = this.getNodeParameter('cursor', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const params: any = {};
					if (txID) params.txID = txID;
					if (startTime) params.startTime = startTime;
					if (endTime) params.endTime = endTime;
					if (coin) params.coin = coin;
					if (cursor) params.cursor = cursor;
					if (limit) params.limit = limit;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/deposit/query-internal-record`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDepositAddress': {
					const coin = this.getNodeParameter('coin', i) as string;
					const chainType = this.getNodeParameter('chainType', i) as string;

					const params: any = { coin };
					if (chainType) params.chainType = chainType;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/deposit/query-address`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWithdrawRecords': {
					const coin = this.getNodeParameter('coin', i) as string;
					const withdrawID = this.getNodeParameter('withdrawID', i) as string;
					const startTime = this.getNodeParameter('startTime', i) as number;
					const endTime = this.getNodeParameter('endTime', i) as number;
					const withdrawType = this.getNodeParameter('withdrawType', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;

					const params: any = {};
					if (coin) params.coin = coin;
					if (withdrawID) params.withdrawID = withdrawID;
					if (startTime) params.startTime = startTime;
					if (endTime) params.endTime = endTime;
					if (withdrawType) params.withdrawType = withdrawType;
					if (limit) params.limit = limit;
					if (cursor) params.cursor = cursor;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/v5/asset/withdraw/query-record`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
						},
						qs: params,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createWithdrawal': {
					const coin = this.getNodeParameter('coin', i) as string;
					const chain = this.getNodeParameter('chain', i) as string;
					const address = this.getNodeParameter('address', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const tag = this.getNodeParameter('tag', i) as string;
					const timestamp = this.getNodeParameter('timestamp', i) as number;
					const forceChain = this.getNodeParameter('forceChain', i) as boolean;
					const accountType = this.getNodeParameter('accountType', i) as string;
					const feeType = this.getNodeParameter('feeType', i) as string;

					const body: any = {
						coin,
						chain,
						address,
						amount,
					};
					if (tag) body.tag = tag;
					if (timestamp) body.timestamp = timestamp;
					if (forceChain !== undefined) body.forceChain = forceChain;
					if (accountType) body.accountType = accountType;
					if (feeType) body.feeType = feeType;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/v5/asset/withdraw/create`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'cancelWithdrawal': {
					const id = this.getNodeParameter('id', i) as string;

					const body: any = { id };

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/v5/asset/withdraw/cancel`,
						headers: {
							'X-BAPI-API-KEY': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeUserOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('bybitexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.testnet ? 'https://api-testnet.bybit.com' : 'https://api.bybit.com';

      switch (operation) {
        case 'createSubMember': {
          const username = this.getNodeParameter('username', i) as string;
          const memberType = this.getNodeParameter('memberType', i) as string;
          const switchValue = this.getNodeParameter('switch', i) as string;
          const note = this.getNodeParameter('note', i) as string;

          const body: any = {
            username,
            memberType: parseInt(memberType),
            switch: parseInt(switchValue),
          };
          if (note) body.note = note;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/create-sub-member`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSubApiKey': {
          const subuid = this.getNodeParameter('subuid', i) as string;
          const note = this.getNodeParameter('note', i) as string;
          const readOnly = this.getNodeParameter('readOnly', i) as string;
          const ips = this.getNodeParameter('ips', i) as string;
          const permissions = this.getNodeParameter('permissions', i) as string;

          const body: any = {
            subuid,
          };
          if (note) body.note = note;
          if (readOnly) body.readOnly = parseInt(readOnly);
          if (ips) body.ips = ips;
          if (permissions) body.permissions = permissions;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/create-sub-api`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubMembers': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v5/user/query-sub-members`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'freezeSubMember': {
          const subuid = this.getNodeParameter('subuid', i) as string;
          const frozen = this.getNodeParameter('frozen', i) as string;

          const body: any = {
            subuid,
            frozen: parseInt(frozen),
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/frozen-sub-member`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getApiKeyInfo': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/v5/user/query-api`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateMasterApiKey': {
          const readOnly = this.getNodeParameter('readOnly', i) as string;
          const ips = this.getNodeParameter('ips', i) as string;
          const permissions = this.getNodeParameter('permissions', i) as string;

          const body: any = {};
          if (readOnly) body.readOnly = parseInt(readOnly);
          if (ips) body.ips = ips;
          if (permissions) body.permissions = permissions;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/modify-master-api`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSubApiKey': {
          const subuid = this.getNodeParameter('subuid', i) as string;
          const readOnly = this.getNodeParameter('readOnly', i) as string;
          const ips = this.getNodeParameter('ips', i) as string;
          const permissions = this.getNodeParameter('permissions', i) as string;

          const body: any = {
            subuid,
          };
          if (readOnly) body.readOnly = parseInt(readOnly);
          if (ips) body.ips = ips;
          if (permissions) body.permissions = permissions;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/modify-sub-api`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteSubApiKey': {
          const subuid = this.getNodeParameter('subuid', i) as string;

          const body: any = {
            subuid,
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/delete-sub-api`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteMasterApiKey': {
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/v5/user/delete-master-api`,
            headers: {
              'X-BAPI-API-KEY': credentials.apiKey,
              'X-BAPI-TIMESTAMP': Date.now().toString(),
              'Content-Type': 'application/json',
            },
            body: {},
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
