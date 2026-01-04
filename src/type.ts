/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
  Authorigins = "_authOrigins",
  Collection = "collection",
  Country = "country",
  Externalauths = "_externalAuths",
  Genre = "genre",
  Language = "language",
  Mfas = "_mfas",
  Movie = "movie",
  MovieStaff = "movieStaff",
  MusicAlbum = "musicAlbum",
  Otps = "_otps",
  Person = "person",
  Role = "role",
  Studio = "studio",
  Superusers = "_superusers",
  Tag = "tag",
  TvEpisode = "tvEpisode",
  TvEpisodeStaff = "tvEpisodeStaff",
  TvSeason = "tvSeason",
  TvSeasonStaff = "tvSeasonStaff",
  TvSeries = "tvSeries",
  TvSeriesStaff = "tvSeriesStaff",
  User = "user"
}

// Alias types for improved usability
export type IsoDateString = string;
export type IsoAutoDateString = { readonly autodate: unique symbol } & string;
export type RecordIdString = string;
export type FileNameString = { readonly filename: unique symbol } & string;
export type HTMLString = string;

type ExpandType<T> = unknown extends T
  ? T extends unknown
    ? { expand?: unknown }
    : { expand: T }
  : { expand: T };

// System fields
export type BaseSystemFields<T = unknown> = {
  collectionId: string;
  collectionName: Collections;
  id: RecordIdString;
} & ExpandType<T>;

export type AuthSystemFields<T = unknown> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AuthoriginsRecord = {
  collectionRef: string;
  created: IsoAutoDateString;
  fingerprint: string;
  id: string;
  recordRef: string;
  updated: IsoAutoDateString;
};

export type ExternalauthsRecord = {
  collectionRef: string;
  created: IsoAutoDateString;
  id: string;
  provider: string;
  providerId: string;
  recordRef: string;
  updated: IsoAutoDateString;
};

export type MfasRecord = {
  collectionRef: string;
  created: IsoAutoDateString;
  id: string;
  method: string;
  recordRef: string;
  updated: IsoAutoDateString;
};

export type OtpsRecord = {
  collectionRef: string;
  created: IsoAutoDateString;
  id: string;
  password: string;
  recordRef: string;
  sentTo?: string;
  updated: IsoAutoDateString;
};

export type SuperusersRecord = {
  created: IsoAutoDateString;
  email: string;
  emailVisibility?: boolean;
  id: string;
  password: string;
  tokenKey: string;
  updated: IsoAutoDateString;
  verified?: boolean;
};

export type CollectionRecord = {
  backdrop?: FileNameString[];
  banners?: FileNameString[];
  contentRatings?: string;
  created: IsoAutoDateString;
  description?: string;
  genres?: RecordIdString[];
  id: string;
  logos?: FileNameString[];
  name: string;
  posters?: FileNameString[];
  rating?: number;
  releaseDate: IsoDateString;
  sortName: string;
  tags?: RecordIdString[];
  thumbnails?: FileNameString[];
  updated: IsoAutoDateString;
};

export type CountryRecord = {
  alpha2: string;
  alpha3: string;
  created: IsoAutoDateString;
  id: string;
  name: string;
  updated: IsoAutoDateString;
};

export type GenreRecord = {
  created: IsoAutoDateString;
  id: string;
  name: string;
  sortName: string;
  updated: IsoAutoDateString;
};

export type LanguageRecord = {
  created: IsoAutoDateString;
  id: string;
  iso639_1: string;
  iso639_2: string;
  name: string;
  updated: IsoAutoDateString;
};

export type MovieRecord = {
  backdrop?: FileNameString[];
  banners?: FileNameString[];
  collections?: RecordIdString[];
  contentRatings?: string;
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  genres?: RecordIdString[];
  homepage?: string;
  id: string;
  language: RecordIdString;
  logos?: FileNameString[];
  matchName?: string;
  name: string;
  posters?: FileNameString[];
  rating?: number;
  releaseDate: IsoDateString;
  sortName: string;
  studios?: RecordIdString[];
  tagline?: string;
  tags?: RecordIdString[];
  thumbnails?: FileNameString[];
  updated: IsoAutoDateString;
};

export type MovieStaffRecord = {
  created: IsoAutoDateString;
  id: string;
  movie: RecordIdString;
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  updated: IsoAutoDateString;
};

export type MusicAlbumRecord = {
  backdrop?: FileNameString[];
  banners?: FileNameString[];
  collections?: RecordIdString[];
  contentRatings?: string;
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  genres?: RecordIdString[];
  id: string;
  language: RecordIdString;
  logos?: FileNameString[];
  matchName?: string;
  name: string;
  posters?: FileNameString[];
  rating?: number;
  releaseDate: IsoDateString;
  sortName: string;
  tags?: RecordIdString[];
  thumbnails?: FileNameString[];
  updated: IsoAutoDateString;
};

export type PersonRecord = {
  avatars?: FileNameString[];
  backdrop?: FileNameString[];
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  dob?: IsoDateString;
  dod?: IsoDateString;
  id: string;
  matchName?: string;
  name: string;
  sortName: string;
  tags?: RecordIdString[];
  thumbnails?: FileNameString[];
  updated: IsoAutoDateString;
};

export enum RoleJellyfinOptions {
  Actor = "Actor",
  Arranger = "Arranger",
  Composer = "Composer",
  Conductor = "Conductor",
  Director = "Director",
  Engineer = "Engineer",
  GuestStar = "GuestStar",
  Lyricist = "Lyricist",
  Mixer = "Mixer",
  Producer = "Producer",
  Remixer = "Remixer",
  Writer = "Writer"
}
export type RoleRecord = {
  created: IsoAutoDateString;
  id: string;
  jellyfin?: RoleJellyfinOptions;
  name: string;
  updated: IsoAutoDateString;
};

export type StudioRecord = {
  backdrop?: FileNameString[];
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  foundedAt?: IsoDateString;
  id: string;
  language: RecordIdString;
  logos?: FileNameString[];
  name: string;
  posters?: FileNameString[];
  sortName: string;
  thumbnails?: FileNameString[];
  updated: IsoAutoDateString;
};

export type TagRecord = {
  created: IsoAutoDateString;
  id: string;
  name: string;
  sortName: string;
  updated: IsoAutoDateString;
};

export type TvEpisodeRecord = {
  airDate: IsoDateString;
  backdrop?: FileNameString[];
  banners?: FileNameString[];
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  id: string;
  language: RecordIdString;
  logos?: FileNameString[];
  name: string;
  order?: number;
  posters?: FileNameString[];
  rating?: number;
  sortName: string;
  thumbnails?: FileNameString[];
  tvSeason: RecordIdString;
  updated: IsoAutoDateString;
};

export type TvEpisodeStaffRecord = {
  created: IsoAutoDateString;
  id: string;
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  tvEpisode: RecordIdString;
  updated: IsoAutoDateString;
};

export type TvSeasonRecord = {
  airDate: IsoDateString;
  backdrop?: FileNameString[];
  banners?: FileNameString[];
  contentRatings?: string;
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  homepage?: string;
  id: string;
  language: RecordIdString;
  logos?: FileNameString[];
  name: string;
  order?: number;
  posters?: FileNameString[];
  rating?: number;
  sortName: string;
  studios?: RecordIdString[];
  tagline?: string;
  thumbnails?: FileNameString[];
  tvSeries: RecordIdString;
  updated: IsoAutoDateString;
};

export type TvSeasonStaffRecord = {
  created: IsoAutoDateString;
  id: string;
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  tvSeason: RecordIdString;
  updated: IsoAutoDateString;
};

export type TvSeriesRecord = {
  backdrop?: FileNameString[];
  banners?: FileNameString[];
  collections?: RecordIdString[];
  contentRatings?: string;
  country: RecordIdString;
  created: IsoAutoDateString;
  description?: string;
  firstAirDate: IsoDateString;
  genres?: RecordIdString[];
  homepage?: string;
  id: string;
  language: RecordIdString;
  lastAirDate?: IsoDateString;
  logos?: FileNameString[];
  matchName?: string;
  name: string;
  posters?: FileNameString[];
  rating?: number;
  sortName: string;
  studios?: RecordIdString[];
  tagline?: string;
  tags?: RecordIdString[];
  thumbnails?: FileNameString[];
  updated: IsoAutoDateString;
};

export type TvSeriesStaffRecord = {
  created: IsoAutoDateString;
  id: string;
  person: RecordIdString;
  priority?: number;
  role: RecordIdString;
  tvSeries: RecordIdString;
  updated: IsoAutoDateString;
};

export type UserRecord = {
  avatar?: FileNameString;
  created: IsoAutoDateString;
  email?: string;
  emailVisibility?: boolean;
  id: string;
  name?: string;
  password: string;
  tokenKey: string;
  updated: IsoAutoDateString;
  username: string;
  verified?: boolean;
};

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<AuthoriginsRecord>;
export type ExternalauthsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<ExternalauthsRecord>;
export type MfasResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MfasRecord>;
export type OtpsResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<OtpsRecord>;
export type SuperusersResponse<Texpand = unknown> = AuthSystemFields<Texpand> & Required<SuperusersRecord>;
export type CollectionResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<CollectionRecord>;
export type CountryResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<CountryRecord>;
export type GenreResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<GenreRecord>;
export type LanguageResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<LanguageRecord>;
export type MovieResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MovieRecord>;
export type MovieStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MovieStaffRecord>;
export type MusicAlbumResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<MusicAlbumRecord>;
export type PersonResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<PersonRecord>;
export type RoleResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<RoleRecord>;
export type StudioResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<StudioRecord>;
export type TagResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TagRecord>;
export type TvEpisodeResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvEpisodeRecord>;
export type TvEpisodeStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvEpisodeStaffRecord>;
export type TvSeasonResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeasonRecord>;
export type TvSeasonStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeasonStaffRecord>;
export type TvSeriesResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeriesRecord>;
export type TvSeriesStaffResponse<Texpand = unknown> = BaseSystemFields<Texpand> & Required<TvSeriesStaffRecord>;
export type UserResponse<Texpand = unknown> = AuthSystemFields<Texpand> & Required<UserRecord>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  _authOrigins: AuthoriginsRecord;
  _externalAuths: ExternalauthsRecord;
  _mfas: MfasRecord;
  _otps: OtpsRecord;
  _superusers: SuperusersRecord;
  collection: CollectionRecord;
  country: CountryRecord;
  genre: GenreRecord;
  language: LanguageRecord;
  movie: MovieRecord;
  movieStaff: MovieStaffRecord;
  musicAlbum: MusicAlbumRecord;
  person: PersonRecord;
  role: RoleRecord;
  studio: StudioRecord;
  tag: TagRecord;
  tvEpisode: TvEpisodeRecord;
  tvEpisodeStaff: TvEpisodeStaffRecord;
  tvSeason: TvSeasonRecord;
  tvSeasonStaff: TvSeasonStaffRecord;
  tvSeries: TvSeriesRecord;
  tvSeriesStaff: TvSeriesStaffRecord;
  user: UserRecord;
};

export type CollectionResponses = {
  _authOrigins: AuthoriginsResponse;
  _externalAuths: ExternalauthsResponse;
  _mfas: MfasResponse;
  _otps: OtpsResponse;
  _superusers: SuperusersResponse;
  collection: CollectionResponse;
  country: CountryResponse;
  genre: GenreResponse;
  language: LanguageResponse;
  movie: MovieResponse;
  movieStaff: MovieStaffResponse;
  musicAlbum: MusicAlbumResponse;
  person: PersonResponse;
  role: RoleResponse;
  studio: StudioResponse;
  tag: TagResponse;
  tvEpisode: TvEpisodeResponse;
  tvEpisodeStaff: TvEpisodeStaffResponse;
  tvSeason: TvSeasonResponse;
  tvSeasonStaff: TvSeasonStaffResponse;
  tvSeries: TvSeriesResponse;
  tvSeriesStaff: TvSeriesStaffResponse;
  user: UserResponse;
};

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
  // Omit AutoDate fields
  [K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]:
  // Convert FileNameString to File
  T[K] extends infer U
    ? U extends (FileNameString | FileNameString[])
      ? U extends any[] ? File[] : File
      : U
    : never
}, "id">;

// Create type for Auth collections
export type CreateAuth<T> = {
  email: string;
  emailVisibility?: boolean;
  id?: RecordIdString;
  password: string;
  passwordConfirm: string;
  verified?: boolean;
} & ProcessCreateAndUpdateFields<T>;

// Create type for Base collections
export type CreateBase<T> = {
  id?: RecordIdString;
} & ProcessCreateAndUpdateFields<T>;

// Update type for Auth collections
export type UpdateAuth<T> = {
  email?: string;
  emailVisibility?: boolean;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
  verified?: boolean;
} & Partial<
  Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
>;

// Update type for Base collections
export type UpdateBase<T> = Partial<
  Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>;

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
  CollectionResponses[T] extends AuthSystemFields
    ? CreateAuth<CollectionRecords[T]>
    : CreateBase<CollectionRecords[T]>;

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
  CollectionResponses[T] extends AuthSystemFields
    ? UpdateAuth<CollectionRecords[T]>
    : UpdateBase<CollectionRecords[T]>;

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
  collection<T extends keyof CollectionResponses>(
    idOrName: T
  ): RecordService<CollectionResponses[T]>;
} & PocketBase;
