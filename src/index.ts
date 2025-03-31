import { pino } from "pino";
import { MediaDataHub } from "./media-data-hub.js";
import type { Logger } from "pino";
import type { AuthOptions, BaseAuthStore } from "pocketbase";

export * from "./media-data-hub.js";
export * from "./type.js";

export interface InitMdhAuthOptions extends AuthOptions {
  email: string;
  password: string;
  store?: BaseAuthStore | null;
}

export interface InitMdhOptions {
  auth: InitMdhAuthOptions;
  baseUrl: string;
  lang?: string;
  logger?: Logger;
}

const defaultLogger = pino({
  transport: {
    options: { colorize: true },
    target: "pino-pretty"
  }
});

/**
 * Create MediaDataHub client and automatically authenticate
 * @param opts Initialize options
 * @returns MediaDataHub client
 */
export async function initMdh(opts: InitMdhOptions): Promise<MediaDataHub> {
  const { auth: { email, password, store, ...authOpts }, baseUrl, lang, logger = defaultLogger } = opts;
  const pb = new MediaDataHub({ authStore: store, baseUrl, lang, logger });
  await pb.collection("_superusers").authWithPassword(email, password, authOpts);
  return pb;
}
