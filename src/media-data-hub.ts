import PocketBase from "pocketbase";
import { ExtendedRecordService } from "./record-service.js";

import type { BaseAuthStore } from "pocketbase";
import type { Logger } from "pino";
import type { BaseSystemFields, Collections } from "./type.js";

export interface MediaDataHubOptions {
  logger: Logger;
  baseUrl?: string;
  authStore?: BaseAuthStore | null;
  lang?: string;
}

export class MediaDataHub extends PocketBase {
  private services: { [key: string]: ExtendedRecordService<Collections> } = {};
  public readonly logger: Logger;

  public constructor(opts: MediaDataHubOptions) {
    const { logger, baseUrl, authStore, lang } = opts;
    super(baseUrl, authStore, lang);
    this.logger = logger;
  }

  public c<C extends Collections>(name: `${C}`): ExtendedRecordService<C> {
    if (!this.services[name]) {
      this.services[name] = new ExtendedRecordService(this, name);
    }
    return this.services[name] as ExtendedRecordService<C>;
  }

  public getAdminThumbUrl(record: BaseSystemFields<unknown>, fileName: string): string {
    return this.files.getUrl(record, fileName, { thumb: "100x100" });
  }

  public f(template: TemplateStringsArray, ...params: unknown[]): string {
    let query = template[0];
    const paramsObj: Record<string, unknown> = {};
    for (const [idx, param] of params.entries()) {
      const key = `param${idx}`;
      paramsObj[key] = param;
      query += `{:${key}}${template[idx + 1]}`;
    }
    return this.filter(query, paramsObj);
  }
}
