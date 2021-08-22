<template>
  <LFeatureGroup ref="editableFeatureGroup" />
</template>

<script lang="ts">
import './leafletDrawLoader';
import { defineComponent, ref, inject, onMounted } from 'vue';
import { LFeatureGroup } from '@vue-leaflet/vue-leaflet';

/**
 * Basic Leaflet-Draw plugin for vue-leaflet
 */
export default defineComponent({
  name: 'LDraw',
  components: {
    LFeatureGroup,
  },
  setup() {
    // Reference to child editable layer
    const editableFeatureGroup = ref<InstanceType<typeof LFeatureGroup>>(null);
    // Reference to leaflet control bar
    const leafletRef = ref({});

    // Get registerControl method from vue-leaflet map component
    const registerControl = inject('registerControl') as (
      control: unknown
    ) => void;

    onMounted(async () => {
      const { Control } = window.L;

      // Instantiate drawing plugin
      leafletRef.value = new Control.Draw({
        edit: {
          featureGroup: editableFeatureGroup.value.leafletObject,
        },
        // FIXME: take options from props
        draw: {
          polyline: false,
          polygon: false,
          rectangle: false,
          marker: false,
          circlemarker: false,
        },
      });
      registerControl({ leafletObject: leafletRef.value });
    });

    // leafletObject nomenclature is used to respect vue-leaflet nomenclature
    return { editableFeatureGroup, leafletObject: leafletRef };
  },
});
</script>
