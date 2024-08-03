import { RecordService } from "pocketbase";
import { Collections } from "./type.js";

import type { ListResult, RecordListOptions } from "pocketbase";
import type { Logger } from "pino";
import type { CollectionResponses, MovieStaffResponse, PersonRecord, PersonResponse, RoleJellyfinOptions, RoleRecord, RoleResponse, TvSeasonStaffResponse, TvSeriesStaffResponse } from "./type.js";
import type { MediaDataHub } from "./media-data-hub.js";

export interface FilterFunction<T> {
  (template: TemplateStringsArray, ...params: unknown[]): Promise<T>;
}

export interface UpdateStaffInput {
  tvSeriesId: string;
  tvSeasonId: string;
  movieId: string;
  countryId: string;
  actors: [string, string, RoleJellyfinOptions] | [string, string];
}

export interface Staff {
  role: RoleResponse;
  person: string;
  priority: number;
}

export class ExtendedRecordService<C extends Collections> extends RecordService<CollectionResponses[C]> {
  public constructor(client: MediaDataHub, collectionIdOrName: string) {
    super(client, collectionIdOrName);
  }

  public first(opts?: Omit<RecordListOptions, "filter">): FilterFunction<CollectionResponses[C] | undefined> {
    return async (template: TemplateStringsArray, ...params: unknown[]) => {
      const filter = this.mdh.f(template, ...params);
      const result = await this.getList(1, 1, { filter, skipTotal: true, ...opts });
      return result?.items[0];
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

  private async findOrCreatePerson(record: Pick<PersonRecord, "country" | "name">): Promise<PersonResponse> {
    const { name, country } = record;
    const collection = Collections.Person;
    let item = await this.mdh.c(collection).first()`name = ${name}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      return item;
    }
    item = await this.mdh.c(collection).first()`matchName = ${name}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by matchName`);
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    return this.mdh.c(collection).create({ name, sortName: name, country });
  }

  private async findOrCreateRole(record: RoleRecord): Promise<RoleResponse> {
    const { name, jellyfin = "Actor" } = record;
    const collection = Collections.Role;
    const item = await this.mdh.c(collection).first()`name = ${name} && jellyfin = ${jellyfin}`;
    if (item) {
      this.logger.info({ collection, id: item.id, name }, `Found ${collection} record by name`);
      return item;
    }
    this.logger.info({ name }, `Cannot find ${collection} record. Create new record`);
    return this.mdh.c(collection).create({ name, jellyfin });
  }

  private async findOrCreateTvSeriesStaff(record: Staff & { tvSeries: string }): Promise<TvSeriesStaffResponse> {
    const { person, role, tvSeries } = record;
    const collection = Collections.TvSeriesStaff;
    const item = await this.mdh.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, tvSeries }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.mdh.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && tvSeries = ${tvSeries}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.mdh.c(collection).create({ ...record, role: role.id, priority });
  }

  private async findOrCreateTvSeasonStaff(record: Staff & { tvSeason: string }): Promise<TvSeasonStaffResponse> {
    const { person, role, tvSeason } = record;
    const collection = Collections.TvSeasonStaff;
    const item = await this.mdh.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, tvSeason }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.mdh.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && tvSeason = ${tvSeason}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.mdh.c(collection).create({ ...record, role: role.id, priority });
  }

  private async findOrCreateMovieStaff(record: Staff & { movie: string }): Promise<MovieStaffResponse> {
    const { person, role, movie } = record;
    const collection = Collections.MovieStaff;
    const item = await this.mdh.c(collection).first()`person = ${person} && role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    if (item) {
      this.logger.info({ collection, id: item.id }, `Found ${collection} record`);
      return item;
    }
    this.logger.info({ person, jellyfin: role.jellyfin, movie }, `Cannot find ${collection} record. Create new record`);
    const latestItem = await this.mdh.c(collection).first({ sort: "-priority" })`role.jellyfin = ${role.jellyfin} && movie = ${movie}`;
    const priority = (latestItem?.priority ?? -1) + 1;
    return this.mdh.c(collection).create({ ...record, role: role.id, priority });
  }

  public async updateStaff(input: UpdateStaffInput): Promise<void> {
    this.logger.info("Start updating staff");
    const { tvSeasonId: tvSeason, tvSeriesId: tvSeries, movieId: movie, actors, countryId: country } = input;
    const priorities: Record<string, number> = {};
    for (const [roleName, personName, jellyfin] of actors) {
      const person = await this.findOrCreatePerson({ name: personName, country });
      const role = await this.findOrCreateRole({ name: roleName, jellyfin: jellyfin as RoleJellyfinOptions });
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
