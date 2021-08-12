type OpendatasoftRecordsApiV1 = {
  nhits: number;
  records: {
    recordid: string;
    fields: {
      geolocetablissement: number[];
      adresseetablissement: string;
      libellecommuneetablissement: string;
      classeetablissement: string;
      // _ is defined by Opendatasoft
      // eslint-disable-next-line
      l1_adressage_unitelegale: string;
      categorieentreprise: string;
      siren: string;
    };
  }[];
  parameters: {
    start: number;
    rows: number;
  };
  // _ is defined by Opendatasoft
  // eslint-disable-next-line
  facet_groups: {
    name: string;
    facets: {
      name: string;
      count: number;
    }[];
  }[];
};

type OpendatasoftRecordsApiV2 = {
  facets: {
    name: string;
    facets: {
      name: string;
      count: number;
    }[];
  }[];
};

type QueryUrlParameters = Record<string, string | number | boolean | undefined>;

export {
  OpendatasoftRecordsApiV1,
  OpendatasoftRecordsApiV2,
  QueryUrlParameters,
};
