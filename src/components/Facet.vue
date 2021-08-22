<template>
  <div
    @click="toggleExpand"
    :title="facet.name"
    class="
      flex
      cursor-pointer
      items-baseline
      justify-between
      overflow-x-hidden
      mb-3
      uppercase
    "
  >
    <div class="flex items-center flex-nowrap min-w-0">
      <ArrowCircleDownIcon
        class="
          h-4
          flex-shrink-0
          transform
          transition
          duration-700
          ease-in-out
          mr-2
        "
        :class="{ '-rotate-90': state.isExpanded }"
      /><span class="font-bold truncate">{{ facet.name }}</span>
    </div>
    <FilterIcon v-if="selection" class="h-5 flex-shrink-0 self-end" />
  </div>
  <div
    class="
      flex flex-col
      overflow-x-hidden
      transition-all
      duration-700
      ease-in-out
    "
    :class="{
      'max-h-96 mb-3': state.isExpanded,
      'max-h-0': !state.isExpanded,
    }"
  >
    <button
      @click="() => handleSelect(possibility)"
      :disabled="isDisabled"
      v-for="possibility in facet.possibilities"
      :key="possibility.name"
      class="
        text-left
        flex
        justify-between
        py-1
        px-4
        rounded
        transition
        duration-200
        hover:bg-green-700
        active:bg-green-400
        hover:text-white
      "
      :class="{
        'bg-green-700 text-white': selection?.name === possibility.name,
        'cursor-not-allowed': isDisabled,
      }"
    >
      <span>{{ possibility.name }}</span> <span>({{ possibility.count }})</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, toRefs } from 'vue';
import { FilterIcon, ArrowCircleDownIcon } from '@heroicons/vue/solid';
import { Facet, FacetPossibility } from '@/types';

/**
 * Events Emitted by this component
 */
enum Events {
  onSelectionChange = 'update:selection',
}

/** Facet card allowing to select a filter */
export default defineComponent({
  components: {
    ArrowCircleDownIcon,
    FilterIcon,
  },
  props: {
    facet: {
      type: Object as PropType<Facet>,
      required: true,
    },
    // Currently selected 'possibility'
    selection: {
      type: Object as PropType<FacetPossibility>,
    },
    // Allow to disable filters update
    isDisabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: Object.values(Events),

  setup(props, { emit }) {
    const { selection } = toRefs(props);

    const state = reactive({
      selection: computed({
        get: () => selection.value,
        set: (value: FacetPossibility | undefined) =>
          emit(Events.onSelectionChange, value),
      }),
      isExpanded: false,
    });

    const toggleExpand = () => {
      state.isExpanded = !state.isExpanded;
    };

    /**
     * FIXME: not sure v-model and handler here is really usefull
     * simple event and handler in parent may be clearer...
     */
    const handleSelect = (possibility: FacetPossibility) => {
      state.selection =
        state.selection?.name === possibility.name ? undefined : possibility;
    };

    return {
      state,
      handleSelect,
      toggleExpand,
    };
  },
});
</script>
