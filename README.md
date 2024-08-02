# @mediadatahub/sdk

## Getting Start

```
npm i @mediadatahub/sdk
```

```ts
import { initMdh } from "@mediadatahub/sdk";
const mdh = await initMdh({ baseUrl, auth: { email, password } });
```

## Usage

### Get collection

```ts
const collection = mdh.c("tvEpisode");
```

```ts
mdh.c("tvEpisode").first()`id = ${id}`;
mdh.c("tvEpisode").list()`id = ${id}`;
mdh.c("tvEpisode").fullList()`id = ${id}`;
```
