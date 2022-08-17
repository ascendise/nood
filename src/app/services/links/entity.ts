export interface HateoasCollection<T, TLinks> extends HateoasEntity<TLinks> {
  _embedded: T | null;
}

export interface HateoasEntity<TLinks> {
  _links: TLinks;
}
