/**
 * Dummy module declaration type for vue-leaflet which does not come with an
 * official one
 * Please add components when needed
 */
declare module '@vue-leaflet/vue-leaflet' {
  import type { Definecomponent } from 'vue';

  const component: Definecomponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;

  export const LMap = component;
  export const LIcon = component;
  export const LTileLayer = component;
  export const LMarker = component;
  export const LControlLayers = component;
  export const LTooltip = component;
  export const LPopup = component;
  export const LPolyline = component;
  export const LPolygon = component;
  export const LRectangle = component;
  export const LCircle = component;
  export const LCircleMarker = component;
  export const LFeatureGroup = component;
}
