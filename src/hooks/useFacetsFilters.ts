import { ref, Ref, onMounted } from 'vue';
import makeClient, { OpendatasoftRecordsApiV2 } from '@/api/opendatasoft';
import { Facet } from '@/types';

/**
 * Hook allowing to retrieve initial facets filter
 */
const useFacetFilters = (): {
  facets: Ref<Facet[]>;
  getFacets: () => Promise<void>;
  isLoading: Ref<boolean>;
} => {
  const facets = ref<Facet[]>([]);
  const isLoading = ref(false);

  const client = makeClient({
    apiKey: process.env.VUE_APP_OPENDATASOFT_APIKEY,
    dataset: 'sirene_v3@public',
  });

  const getFacets = async () => {
    isLoading.value = true;
    facets.value = (
      (await client.getFacets()) as OpendatasoftRecordsApiV2
    ).facets.map(({ name, facets: possibilities }) => ({
      name,
      possibilities,
    }));
    isLoading.value = false;
  };

  onMounted(getFacets);

  return {
    facets,
    getFacets,
    isLoading,
  };
};

export default useFacetFilters;
