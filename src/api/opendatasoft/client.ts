import { QueryUrlParameters } from './types';

enum APIV1 {
  getRecords = '/records/1.0/search',
  getClusters = '/records/1.0/geocluster',
}

enum APIV2 {
  getFacets = '/facets',
}

enum Method {
  Get = 'GET',
}

/**
 * Format parameters query string
 *
 * This method can take several object to handle repeated parameters (ex: facet).
 */
const formatParameters = (...parameters: QueryUrlParameters[]): string =>
  parameters
    ? // Copy reference and name only if defined to avoid having the key in the query
      parameters
        .flatMap((parameterSet) =>
          Object.entries(parameterSet).filter(
            ([, value]) => value !== undefined
          )
        )
        // Format to search query parameters
        .reduce(
          (acc, [key, value]) =>
            `${acc}${acc === '?' ? '' : '&'}${key}=${value}`,
          '?'
        )
    : '';

const makeApiV2Request = (dataset: string, request: APIV2) =>
  `/v2/opendatasoft/datasets/${dataset}${request}`;

/**
 * Make basic Opendatasoft client which request data from Api V1 or V2 depending
 * on the need.
 *
 * The two API versions are used because Facet retrieval is only available on
 * V2 but geo filtering seems to be broken on it...
 *
 * FIXME: use V2 only
 *
 * FIXME: Return type of the query has to be precised as template parameter
 * could not succeed to let typescript infer the type...
 */
const makeClient = ({
  domain = 'public',
  dataset,
  apiKey,
}: {
  dataset: string;
  domain?: string;
  apiKey?: string;
}): Record<
  string,
  <T>(...queryUrlParameters: QueryUrlParameters[]) => Promise<T>
> => {
  const baseUrl = `https://${domain}.opendatasoft.com/api`;
  const request = (
    route: string,
    method: Method,
    ...parameters: QueryUrlParameters[]
  ) =>
    fetch(`${baseUrl}${route}${formatParameters(...parameters)}`, {
      method,
    });

  return {
    // Generate API V1 requesters
    ...Object.entries(APIV1).reduce(
      (acc, [key, api]) => ({
        ...acc,
        [key]: (...queryParameters: QueryUrlParameters[]) =>
          request(
            api,
            Method.Get,
            {
              dataset,
              // Pass API key through parameters as using Authorization headers is not working...
              apiKey,
            },
            ...queryParameters
          ).then((result) => result.json()),
      }),
      {}
    ),
    // Generate API V2 requesters
    ...Object.entries(APIV2).reduce(
      (acc, [key, api]) => ({
        ...acc,
        [key]: (...queryParameters: QueryUrlParameters[]) =>
          request(
            makeApiV2Request(dataset, api),
            Method.Get,
            {
              // Pass API key through parameters as using Authorization headers is not working...
              apiKey,
            },
            ...queryParameters
          ).then((result) => result.json()),
      }),
      {}
    ),
  };
};

export default makeClient;
