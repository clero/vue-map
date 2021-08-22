<template>
  <div class="flex flex-col text-center m-2 w-72 divide-y divide-y-green-500">
    <div class="flex flex-col mb-2">
      <p class="text-xl font-bold">{{ enterprise.name || 'Inconnu' }}</p>
      <p class="font-light">{{ enterprise.address || 'Inconnu' }}</p>
      <div class="flex items-center">
        <ScaleIcon class="h-5 px-2 text-green-500" />
        <span class="text-left">{{ enterprise.type || 'Inconnu' }}</span>
      </div>
      <div class="flex items-center">
        <IdentificationIcon class="h-5 px-2 text-green-500" />
        <span class="text-left">{{ enterprise.siret || 'Inconnu' }}</span>
      </div>
      <div class="flex items-center">
        <InformationCircleIcon class="h-5 px-2 text-green-500" />
        <span class="text-left">{{ enterprise.description || 'Inconnu' }}</span>
      </div>
    </div>
    <div class="pt-2">
      <button @click="handlePrevious" :disabled="isPreviousDisabled">
        <ArrowCircleLeftIcon
          class="h-5 px-2"
          :class="{
            'text-green-500': !isPreviousDisabled,
            'text-gray-300': isPreviousDisabled,
          }"
        />
      </button>
      <button @click="handleNext" :disabled="isNextDisabled">
        <ArrowCircleRightIcon
          class="h-5 px-2"
          :class="{
            'text-green-500': !isNextDisabled,
            'text-gray-300': isNextDisabled,
          }"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue';
import {
  ScaleIcon,
  IdentificationIcon,
  InformationCircleIcon,
  ArrowCircleRightIcon,
  ArrowCircleLeftIcon,
} from '@heroicons/vue/solid';
import { Enterprise } from '@/types';

export default defineComponent({
  components: {
    ScaleIcon,
    IdentificationIcon,
    InformationCircleIcon,
    ArrowCircleRightIcon,
    ArrowCircleLeftIcon,
  },
  props: {
    enterprises: {
      type: Array as PropType<Enterprise[]>,
      required: true,
    },
  },
  setup(props) {
    const currentPage = ref(0);

    return {
      enterprise: computed(() => props.enterprises[currentPage.value]),
      handleNext: () => {
        if (currentPage.value < props.enterprises.length - 1) {
          currentPage.value += 1;
        }
      },
      handlePrevious: () => {
        if (currentPage.value > 0) {
          currentPage.value -= 1;
        }
      },
      isNextDisabled: computed(
        () => currentPage.value === props.enterprises.length - 1
      ),
      isPreviousDisabled: computed(() => currentPage.value === 0),
    };
  },
});
</script>
