export type IEntryFiles = string[];

export interface IEntryGlob {
  dir: string;
  include?: string[];
  exclude?: string[];
}

export type IEntry = IEntryFiles | IEntryGlob;

export interface IResolveConfig {
  recursion?: boolean;
  ignore?: (dep: string, from: string) => boolean;
  alias: Record<string, string>;
  extensions?: string[];
}

export interface IResolveDepConfig {
  entry: IEntry;
  resolve?: IResolveConfig;
  includeIgnore?: boolean;
}

export interface IResolvedModule {
  name: string;
  deps: IResolvedModule[];
  ignore?: boolean;
}
