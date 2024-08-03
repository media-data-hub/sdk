import PocketBase from "pocketbase";
import { ExtendedRecordService } from "./record-service.js";
import { Collections } from "./type.js";

import type { BaseAuthStore } from "pocketbase";
import type { Logger } from "pino";
import type { BaseSystemFields, MovieStaffResponse, PersonRecord, PersonResponse, RoleJellyfinOptions, RoleRecord, RoleResponse, TvSeasonStaffResponse, TvSeriesStaffResponse } from "./type.js";

export interface MediaDataHubOptions {
  logger: Logger;
  baseUrl?: string;
  authStore?: BaseAuthStore | null;
  lang?: string;
}

export interface UpdateStaffInput {
  tvSeriesId?: string;
  tvSeasonId?: string;
  movieId?: string;
  countryId: string;
  actors: ([string, string, RoleJellyfinOptions] | [string, string])[];
}

export interface Staff {
  role: RoleResponse;
  person: string;
  priority: number;
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

  private async findOrCreatePerson(record: Pick<PersonRecord, "country" | "name">): Promise<PersonResponse> {
    const { name, country } = record;
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
    return this.c(collection).create({ name, sortName: name, country });
  }

  private async findOrCreateRole(record: RoleRecord): Promise<RoleResponse> {
    const { name, jellyfin = "Actor" } = record;
    const collection = Collections.Role;
    const item = await this.c(collection).first()`name = ${name} && jellyfin = ${jellyfin}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    return this.c(collection).create({ name, jellyfin });
  }

  private async findOrCreateTvSeriesStaff(record: Staff & { tvSeries: string }): Promise<TvSeriesStaffResponse> {
    const { person, role, tvSeries } = record;
    const collection = Collections.TvSeriesStaff;
    const item = await this.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, tvSeries }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.c(collection).create({ ...record, role: role.id, priority });
  }

  private async findOrCreateTvSeasonStaff(record: Staff & { tvSeason: string }): Promise<TvSeasonStaffResponse> {
    const { person, role, tvSeason } = record;
    const collection = Collections.TvSeasonStaff;
    const item = await this.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, tvSeason }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.c(collection).create({ ...record, role: role.id, priority });
  }

  private async findOrCreateMovieStaff(record: Staff & { movie: string }): Promise<MovieStaffResponse> {
    const { person, role, movie } = record;
    const collection = Collections.MovieStaff;
    const item = await this.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, movie }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.c(collection).create({ ...record, role: role.id, priority });
  }

  public async updateStaff(input: UpdateStaffInput): Promise<void> {
    this.logger.info("Start updating staff");
    const { tvSeasonId: tvSeason, tvSeriesId: tvSeries, movieId: movie, actors, countryId: country } = input;
    const priorities: Record<string, number> = {};
    for (const [roleName, personName, jellyfin] of actors) {
      const person = await this.findOrCreatePerson({ name: personName, country });
      const role = await this.findOrCreateRole({ name: roleName, jellyfin });
      priorities[role.jellyfin] ??= 0;
      const priority = priorities[role.jellyfin];
      if (tvSeries) {
        await this.findOrCreateTvSeriesStaff({ tvSeries, person: person.id, role, priority });
      }
      if (tvSeason) {
        await this.findOrCreateTvSeasonStaff({ tvSeason, person: person.id, role, priority });
      }
      if (movie) {
        await this.findOrCreateMovieStaff({ movie, person: person.id, role, priority });
      }
      priorities[role.jellyfin]++;
    }
  }
}
