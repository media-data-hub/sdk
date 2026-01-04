import PocketBase from "pocketbase";
import { ExtendedRecordService } from "./record-service.js";
import { Collections } from "./type.js";
import type { Logger } from "pino";
import type { BaseAuthStore } from "pocketbase";
import type {
  BaseSystemFields,
  IsoAutoDateString,
  MovieStaffResponse,
  PersonRecord,
  PersonResponse,
  RoleJellyfinOptions,
  RoleRecord,
  RoleResponse,
  TvSeasonStaffResponse,
  TvSeriesStaffResponse
} from "./type.js";

export interface MediaDataHubOptions {
  authStore?: BaseAuthStore | null;
  baseUrl?: string;
  lang?: string;
  logger: Logger;
}

export interface UpdateStaffInput {
  actors: ([string, string, RoleJellyfinOptions] | [string, string])[];
  countryId: string;
  movieId?: string;
  tvSeasonId?: string;
  tvSeriesId?: string;
}

export interface Staff {
  person: string;
  priority: number;
  role: RoleResponse;
}

type Optional<T, U extends keyof T> = Partial<Pick<T, U>> & Pick<T, Exclude<keyof T, U>>;
type AutoDateKey<T> = keyof {
  [K in keyof T as T[K] extends IsoAutoDateString ? K : never]: any
};
type CreateInput<T> = AutoDateKey<T> | "id" extends keyof T ? Optional<T, AutoDateKey<T> | "id"> : never;

export class MediaDataHub extends PocketBase {
  private services: Record<string, ExtendedRecordService<Collections>> = {};
  public readonly logger: Logger;

  public constructor(opts: MediaDataHubOptions) {
    const { authStore, baseUrl, lang, logger } = opts;
    super(baseUrl, authStore, lang);
    this.logger = logger;
  }

  public c<C extends Collections>(name: `${C}`): ExtendedRecordService<C> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!this.services[name]) {
      this.services[name] = new ExtendedRecordService(this, name);
    }
    return this.services[name] as ExtendedRecordService<C>;
  }

  public getAdminThumbUrl(record: BaseSystemFields, fileName: string): string {
    return this.files.getURL(record, fileName, { thumb: "100x100" });
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

  private async findOrCreatePerson(record: Pick<PersonRecord, "country" | "name">): Promise<PersonResponse> {
    const { country, name } = record;
    const collection = Collections.Person;
    let item = await this.c(collection).first()`name = ${name}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      return item;
    }
    item = await this.c(collection).first()`matchName = ${name}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by matchName`);
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    return this.c(collection).create({ country, name, sortName: name });
  }

  private async findOrCreateRole(record: CreateInput<RoleRecord>): Promise<RoleResponse> {
    const { jellyfin = "Actor", name } = record;
    const collection = Collections.Role;
    const item = await this.c(collection).first()`name = ${name} && jellyfin = ${jellyfin}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    return this.c(collection).create({ jellyfin, name });
  }

  private async findOrCreateTvSeriesStaff(record: { tvSeries: string } & Staff): Promise<TvSeriesStaffResponse> {
    const { person, role, tvSeries } = record;
    const collection = Collections.TvSeriesStaff;
    const item = await this.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ jellyfin: role.jellyfin, person, tvSeries }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.c(collection).create({ ...record, priority, role: role.id });
  }

  private async findOrCreateTvSeasonStaff(record: { tvSeason: string } & Staff): Promise<TvSeasonStaffResponse> {
    const { person, role, tvSeason } = record;
    const collection = Collections.TvSeasonStaff;
    const item = await this.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ jellyfin: role.jellyfin, person, tvSeason }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.c(collection).create({ ...record, priority, role: role.id });
  }

  private async findOrCreateMovieStaff(record: { movie: string } & Staff): Promise<MovieStaffResponse> {
    const { movie, person, role } = record;
    const collection = Collections.MovieStaff;
    const item = await this.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ jellyfin: role.jellyfin, movie, person }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.c(collection).create({ ...record, priority, role: role.id });
  }

  public async updateStaff(input: UpdateStaffInput): Promise<void> {
    this.logger.info("Start updating staff");
    const { actors, countryId: country, movieId: movie, tvSeasonId: tvSeason, tvSeriesId: tvSeries } = input;
    const priorities: Record<string, number> = {};
    for (const [roleName, personName, jellyfin] of actors) {
      const person = await this.findOrCreatePerson({ country, name: personName });
      const role = await this.findOrCreateRole({ jellyfin, name: roleName });
      priorities[role.jellyfin] ??= 0;
      const priority = priorities[role.jellyfin];
      if (tvSeries) {
        await this.findOrCreateTvSeriesStaff({ person: person.id, priority, role, tvSeries });
      }
      if (tvSeason) {
        await this.findOrCreateTvSeasonStaff({ person: person.id, priority, role, tvSeason });
      }
      if (movie) {
        await this.findOrCreateMovieStaff({ movie, person: person.id, priority, role });
      }
      priorities[role.jellyfin]++;
    }
  }
}
