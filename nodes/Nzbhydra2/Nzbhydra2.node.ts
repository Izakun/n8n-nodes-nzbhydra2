import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class Nzbhydra2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NZBHydra2',
		name: 'nzbhydra2',
		icon: { light: 'file:nzbhydra2.svg', dark: 'file:nzbhydra2-dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Search across your NZBHydra2 indexers (Newznab API)',
		defaults: { name: 'NZBHydra2' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'nzbhydra2Api', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Capabilities', value: 'caps', action: 'Get the indexer capabilities' },
					{ name: 'Search', value: 'search', action: 'Search across indexers' },
				],
				default: 'search',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Categories',
				name: 'cat',
				type: 'string',
				default: '',
				placeholder: '2000,5000',
				description: 'Comma-separated Newznab category IDs',
				displayOptions: { show: { operation: ['search'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('nzbhydra2Api', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const operation = this.getNodeParameter('operation', i) as string;
				const param = <T>(name: string, fallback?: T) =>
					this.getNodeParameter(name, i, fallback as T) as T;

				const qs: IDataObject = { t: operation === 'caps' ? 'caps' : 'search', o: 'json' };
				if (operation === 'search') {
					qs.q = param<string>('query');
					const cat = param<string>('cat', '');
					if (cat) qs.cat = cat;
				}

				const options: IHttpRequestOptions = {
					method: 'GET' as IHttpRequestMethods,
					baseURL,
					url: '/api',
					qs,
					json: true,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'nzbhydra2Api',
					options,
				);

				returnData.push({
					json: (typeof response === 'object' && response !== null
						? response
						: { result: response }) as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
