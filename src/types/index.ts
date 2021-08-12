type Position = { latitude: number; longitude: number };

type Zone = { position: number[]; radius: number };

type Enterprise = {
  id: string;
  siren: string;
  name: string;
  address: string;
  type: string;
  description: string;
  location: Position;
};

type FacetPossibility = {
  name: string;
  count: number;
};

type Facet = {
  name: string;
  possibilities: FacetPossibility[];
};

export { Zone, Enterprise, Position, Facet, FacetPossibility };
