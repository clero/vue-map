<template>
  <Layout>
    <template #logo>
      <div class="text-gray-800 flex items-center space-x-2 px-4">
        <FilterIcon class="h-8" :class="{ 'animate-spin': isLoading }" />
        <span class="text-2xl font-extrabold">Filters</span>
      </div>
    </template>
    <template #sidebar>
      <div class="flex-1 max-h-full overflow-y-auto">
        <Facet
          :key="facet.name"
          v-for="facet in facets"
          :facet="facet"
          :isDisabled="isLoading"
          v-model:selection="
            facetSelections.find(({ name }) => name === facet.name).selection
          "
        />
      </div>
    </template>
    <div class="h-full">
      <Map
        v-model:zoom="zoom"
        v-model:bounds="bounds"
        v-model:zone="searchedZone"
      >
        <LMarker
          :key="key"
          v-for="[key, { location, enterprises }] in Object.entries(
            enterprises
          )"
          :latLng="[location.latitude, location.longitude]"
        >
          <LPopup>
            <Entreprises :enterprises="enterprises" />
          </LPopup>
        </LMarker>
      </Map>
    </div>
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { LatLngBounds } from 'leaflet';
import { FilterIcon } from '@heroicons/vue/solid';
import Map from '@/components/map';
import Layout from '@/components/Layout.vue';
import Entreprises from '@/components/Enterprises.vue';
import Facet from '@/components/Facet.vue';
import useEnterprises from '@/hooks/useEnterprises';
import { Enterprise, Position } from '@/types';

export default defineComponent({
  components: {
    Map,
    LMarker,
    LPopup,
    Entreprises,
    Layout,
    FilterIcon,
    Facet,
  },
  setup() {
    const searchedZone = ref();
    const zoom = ref(8);
    const bounds = ref<LatLngBounds | undefined>(undefined);

    const { facets, facetSelections, enterprises, isLoading } =
      useEnterprises(searchedZone);

    return {
      // Enterprises gathered by location
      enterprises: computed(() =>
        enterprises.reduce(
          (
            acc: Record<
              string,
              { location: Position; enterprises: Enterprise[] }
            >,
            enterprise
          ) => {
            const locationKey = `${enterprise.location.latitude}${enterprise.location.longitude}`;
            const enterprisesOnLocation = acc[locationKey];

            if (enterprisesOnLocation === undefined) {
              acc[locationKey] = {
                location: enterprise.location,
                enterprises: [enterprise],
              };
            } else {
              enterprisesOnLocation.enterprises.push(enterprise);
            }
            return acc;
          },
          {}
        )
      ),
      facets,
      facetSelections,
      searchedZone,
      zoom,
      bounds,
      isLoading,
    };
  },
});
</script>
