import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Nzbhydra2Api implements ICredentialType {
	name = 'nzbhydra2Api';

	displayName = 'NZBHydra2 API';

	icon = 'file:nzbhydra2Api.svg' as const;

	documentationUrl = 'https://github.com/theotherp/nzbhydra2';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://nzbhydra2:5076',
			required: true,
			description: 'Base URL of NZBHydra2 (e.g. http://nzbhydra2:5076). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'NZBHydra2 API key (Config → Search → API)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api',
			qs: { t: 'caps', o: 'json' },
		},
	};
}
