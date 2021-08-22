<template>
  <LMap
    @draw:created="handleCreation"
    @draw:edited="handleEdition"
    @draw:deleted="handleDeletion"
    v-model:zoom="state.zoom"
    v-model:bounds="state.bounds"
    :center="initialPosition"
    :maxZoom="$options.maxZoom"
    :minZoom="$options.minZoom"
    :useGlobalLeaflet="true"
    :options="$options.leafletOptions"
    ref="map"
  >
    <LTileLayer :url="$options.tilesUrl" />
    <LDraw ref="draw" />
    <slot />
  </LMap>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  toRefs,
  reactive,
} from 'vue';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { CircleMarker, DrawEvents, LatLngBounds, Layer } from 'leaflet';
import { Zone } from '@/types';
import LDraw from './draw';

/**
 * Events Emitted by this component
 */
enum Events {
  onBoundsChange = 'update:bounds',
  onZoomChange = 'update:zoom',
  onZoneChange = 'update:zone',
}

/**
 * Vue Leaflet map wrapper which setup it for this application needs.
 */
export default defineComponent({
  // Static URL for tiles
  tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  // Zoom range working well with openstreetmap
  minZoom: 2,
  maxZoom: 19,
  leafletOptions: {
    // Used for performance as we may render many markers
    preferCanvas: true,
  },

  components: {
    LMap,
    LTileLayer,
    LDraw,
  },

  emits: Object.values(Events),

  props: {
    zoom: {
      type: Number,
      default: 8,
    },
    initialPosition: {
      type: Array as PropType<number[]>,

      // Toulouse localisation
      default: () => [43.604429, 1.443812],
    },
    bounds: {
      type: Object as PropType<LatLngBounds>,
    },
    zone: {
      type: Object as PropType<Zone>,
    },
  },

  setup(props, { emit }) {
    const { zoom, bounds, zone } = toRefs(props);
    const map = ref<InstanceType<typeof LMap>>();
    const draw = ref<InstanceType<typeof LDraw>>();

    const state = reactive({
      zoom: computed({
        get: () => zoom.value,
        set: (value: number) => emit(Events.onZoomChange, value),
      }),
      bounds: computed({
        get: () => bounds.value,
        set: (value: LatLngBounds | undefined) =>
          emit(Events.onBoundsChange, value),
      }),
      zone: computed({
        get: () => zone.value,
        set: (value: Zone | undefined) => emit(Events.onZoneChange, value),
      }),
    });

    const updateSelection = (layer: Layer, newBounds: LatLngBounds) => {
      // Set selected zone
      if (layer instanceof CircleMarker) {
        const { lat, lng } = layer.getLatLng();

        state.zone = {
          position: [lat, lng],
          radius: layer.getRadius(),
        };

        // Update Map bounds
        state.bounds = newBounds;
      }
    };

    const handleCreation = (event: DrawEvents.Created) => {
      const featureGroup = draw?.value?.editableFeatureGroup.leafletObject;

      // Remove previous selection
      featureGroup.clearLayers();

      // Add new item to editable layer
      featureGroup.addLayer(event.layer);

      updateSelection(event.layer, featureGroup.getBounds());
    };

    const handleEdition = () => {
      // FIXME would be easier to use event 'layers' object but cannot
      // find a way to get bounds from it
      const featureGroup = draw?.value?.editableFeatureGroup.leafletObject;

      const [layer] = featureGroup.getLayers();

      updateSelection(layer, featureGroup.getBounds());
    };

    const handleDeletion = () => {
      state.zone = undefined;
    };

    return {
      map,
      draw,
      handleCreation,
      handleEdition,
      handleDeletion,
      state,
    };
  },
});
</script>
