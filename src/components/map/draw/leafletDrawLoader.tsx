/**
 * Load leaflet and leaflet-draw modules.
 *
 * This is done in a dedicated file to let user import modules types if needed
 * after loading.
 * If types are imported before the call of this file leaflet-draw may not
 * initialize correctly.
 *
 * This module add leaflet-draw to leaflet library. Only imported library is
 * populated and other instances are not. This should not be used with async
 * library import and SSR.
 */
import 'leaflet';
import 'leaflet-draw';
