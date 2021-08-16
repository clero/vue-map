import { ref, Ref, watch, reactive } from 'vue';
import makeClient, {
  OpendatasoftRecordsApiV1,
  adaptEnterprises,
} from '@/api/opendatasoft';
import { Facet, Zone, Enterprise, FacetPossibility } from '@/types';
import useFacetsFilters from '@/hooks/useFacetsFilters';

const makeDistanceFilter = ({
  position: [latitude, longitude],
  radius,
}: Zone) => `${latitude}, ${longitude}, ${radius}`;

/**
 * Hook allowing to retrieve all enterprises in a given area
 */
const useEnterprises = (
  searchedZone: Ref<Zone>
): {
  enterprises: Enterprise[];
  facets: Ref<Facet[]>;
  facetSelections: { name: string; selection: FacetPossibility | undefined }[];
  getEnterprises: () => Promise<void>;
  isLoading: Ref<boolean>;
} => {
  const enterprises = reactive<Enterprise[]>([]);
  const refinedFacets = ref<Facet[]>([]);
  const facetSelections = reactive<
    { name: string; selection: FacetPossibility | undefined }[]
  >([]);
  const isLoading = ref(false);
  const nextPage = ref(0);

  const client = makeClient({
    apiKey: process.env.VUE_APP_OPENDATASOFT_APIKEY,
    dataset: 'sirene_v3@public',
  });

  const { facets: initialFacets, isLoading: isInitialFacetsLoading } =
    useFacetsFilters();

  const getEnterprises = async () => {
    isLoading.value = true;

    const facets = initialFacets.value.map(({ name }) => ({ facet: name }));
    const facetSelectionsString = facetSelections.reduce(
      (acc, { name, selection }) => ({
        ...acc,
        [`refine.${name}`]: selection?.name,
      }),
      {}
    );
    const result = searchedZone.value
      ? await client.getRecords<OpendatasoftRecordsApiV1>(
          {
            'geofilter.distance': makeDistanceFilter(searchedZone.value),
            rows: 100,
            start: nextPage.value,
            ...facetSelectionsString,
          },
          ...facets
        )
      : undefined;

    if (result) {
      if (nextPage.value === 0) {
        enterprises.splice(0, enterprises.length);
      }

      const hits = result.nhits;
      const { start, rows } = result.parameters;

      if (start + rows < hits) {
        nextPage.value = start + rows;
        // fetch another page async
        // maker enterprises reactive
      } else {
        nextPage.value = 0;
      }

      enterprises.push(...adaptEnterprises(result));
      refinedFacets.value = result.facet_groups?.map(
        ({ name, facets: possibilities }) => ({
          name,
          possibilities,
        })
      );
    } else {
      enterprises.splice(0, enterprises.length);
      refinedFacets.value = initialFacets.value;
    }
    isLoading.value = false;
  };

  const computeRefinedFacets = () => {
    if (refinedFacets.value.length === 0) {
      refinedFacets.value = initialFacets.value;
      facetSelections.push(
        ...refinedFacets.value.map(({ name }: Facet) => ({
          name,
          selection: undefined,
        }))
      );
    }
  };
  const computeLoadingState = () => {
    isLoading.value = isInitialFacetsLoading.value || isLoading.value;
  };

  watch(searchedZone, getEnterprises);
  watch(facetSelections, getEnterprises);
  watch(nextPage, (newPage) => newPage !== 0 && getEnterprises());
  watch(initialFacets, computeRefinedFacets);

  watch(isInitialFacetsLoading, computeLoadingState);
  watch(isLoading, computeLoadingState);

  return {
    enterprises,
    facets: refinedFacets,
    facetSelections,
    getEnterprises,
    isLoading,
  };
};

export default useEnterprises;
