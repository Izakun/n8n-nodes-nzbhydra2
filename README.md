# n8n-nodes-nzbhydra2

[![npm version](https://img.shields.io/npm/v/n8n-nodes-nzbhydra2.svg)](https://www.npmjs.com/package/n8n-nodes-nzbhydra2)

n8n community node for NZBHydra2 (indexer aggregator) via its Newznab API

Install via **Settings -> Community Nodes -> Install** -> `n8n-nodes-nzbhydra2`.

## Usage example

Search across indexers (Newznab):

1. Add the node after a trigger (e.g. *When clicking 'Test workflow'*).
2. Select your credential.
3. **Search** with a query.
4. Execute the node — example output:

```json
{ "title": "Ubuntu.24.04", "indexer": "NZBgeek", "size": 6114887290, "grabs": 12 }
```

## Disclaimer
Not affiliated with or endorsed by the respective project.
