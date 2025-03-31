import { RecordService } from "pocketbase";
import type { Logger } from "pino";
import type { ListResult, RecordListOptions } from "pocketbase";
import type { MediaDataHub } from "./media-data-hub.js";
import type { CollectionResponses, Collections } from "./type.js";

export interface FilterFunction<T> {
  (template: TemplateStringsArray, ...params: unknown[]): Promise<T>;
}

export class ExtendedRecordService<C extends Collections> extends RecordService<CollectionResponses[C]> {
  public constructor(client: MediaDataHub, collectionIdOrName: string) {
    super(client, collectionIdOrName);
  }

  public first(opts?: Omit<RecordListOptions, "filter">): FilterFunction<CollectionResponses[C] | undefined> {
    return async (template: TemplateStringsArray, ...params: unknown[]) => {
      const filter = this.mdh.f(template, ...params);
      const result = await this.getList(1, 1, { filter, skipTotal: true, ...opts });
      return result.items[0];
    };
  }

  public list(page = 1, perPage = 100, skipTotal = true): FilterFunction<ListResult<CollectionResponses[C]>> {
    return async (template, ...params) => {
      const filter = this.mdh.f(template, ...params);
      return this.getList(page, perPage, { filter, skipTotal });
    };
  }

  public fullList(batch = 200): FilterFunction<CollectionResponses[C][]> {
    return async (template, ...params) => {
      const filter = this.mdh.f(template, ...params);
      return this.getFullList(batch, { filter });
    };
  }

  private get mdh(): MediaDataHub {
    return this.client as MediaDataHub;
  }

  private get logger(): Logger {
    return this.mdh.logger;
  }
}
