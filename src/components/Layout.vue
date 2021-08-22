<template>
  <div class="h-screen flex flex-col md:flex-row">
    <!-- Little screens toolbar -->
    <div class="bg-green-500 text-gray-600 flex justify-between md:hidden">
      <!-- Use dedicated slot for logo to let each view animate it -->
      <slot name="logo"></slot>
      <button
        @click="toggleSideBar"
        class="mobile-menu-button p-4 focus:outline-none focus:bg-green-600"
      >
        <MenuIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Customizable sidebar -->
    <div
      class="
        sidebar
        flex flex-col
        bg-green-200
        text-gray-600 text-base
        md:text-sm
        w-80
        py-7
        px-2
        space-y-6
        absolute
        inset-y-0
        left-0
        transform
        md:relative md:translate-x-0
        transition
        duration-200
        ease-in-out
      "
      :class="{ '-translate-x-full': !isSidebarDisplayed }"
    >
      <slot name="logo"></slot>
      <slot name="sidebar"></slot>
    </div>

    <!-- Content -->
    <div
      class="
        flex-1
        transform
        md:translate-x-0
        transition
        duration-200
        ease-in-out
      "
      :class="{
        'translate-x-80': isSidebarDisplayed,
        '-translate-x-0': !isSidebarDisplayed,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MenuIcon } from '@heroicons/vue/solid';

/**
 * Responsive Layout
 *
 * inspired from https://www.youtube.com/watch?v=DOOoS6GHDw8
 */
export default defineComponent({
  components: {
    MenuIcon,
  },
  setup() {
    const isSidebarDisplayed = ref(false);

    const toggleSideBar = () => {
      isSidebarDisplayed.value = !isSidebarDisplayed.value;
    };

    return { toggleSideBar, isSidebarDisplayed };
  },
});
</script>
