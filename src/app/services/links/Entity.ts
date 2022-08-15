export interface HateoasCollection<T, TLinks> extends HateoasEntity<TLinks> {
  _embedded: T;
}

export interface HateoasEntity<TLinks> {
  _links: TLinks;
}
