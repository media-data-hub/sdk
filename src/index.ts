import { pino } from "pino";
import { MediaDataHub } from "./media-data-hub.js";

import type { AuthOptions, BaseAuthStore } from "pocketbase";
import type { Logger } from "pino";

export * from "./media-data-hub.js";
export * from "./type.js";

export interface InitMdhAuthOptions extends AuthOptions {
  email: string;
  password: string;
  store?: BaseAuthStore | null;
}

export interface InitMdhOptions {
  baseUrl: string;
  lang?: string;
  auth: InitMdhAuthOptions;
  logger?: Logger;
}

const defaultLogger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
});

/**
 * Create MediaDataHub client and automatically authenticate
 * @param opts Initialize options
 * @returns MediaDataHub client
 */
export async function initMdh(opts: InitMdhOptions): Promise<MediaDataHub> {
  const { logger = defaultLogger, baseUrl, lang, auth: { store, email, password, ...authOpts } } = opts;
  const pb = new MediaDataHub({ logger, baseUrl, authStore: store, lang });
  await pb.admins.authWithPassword(email, password, authOpts);
  return pb;
}
