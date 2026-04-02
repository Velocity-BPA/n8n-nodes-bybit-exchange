import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BybitExchangeApi implements ICredentialType {
	name = 'bybitExchangeApi';
	displayName = 'Bybit Exchange API';
	documentationUrl = 'https://bybit-exchange.github.io/docs/v5/intro';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: false,
			},
			default: '',
			required: true,
			description: 'The API Key from your Bybit account',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Secret Key from your Bybit account',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.bybit.com',
			required: true,
			description: 'The base URL for the Bybit API',
		},
		{
			displayName: 'Testnet',
			name: 'testnet',
			type: 'boolean',
			default: false,
			description: 'Whether to use the testnet environment',
		},
		{
			displayName: 'Receive Window (ms)',
			name: 'recvWindow',
			type: 'number',
			default: 5000,
			description: 'The receive window for API requests in milliseconds',
		},
	];
}