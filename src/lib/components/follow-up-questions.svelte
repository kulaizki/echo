<script lang="ts">
  export let options: string[];
  export let onSelect: (option: string) => void;
</script>

<div class="mt-6 space-y-3">
  <p class="text-lg dark:text-gray-300 light:text-gray-700 mb-4">I would love to hear more about your feelings. Please tell me more about it.</p>
  {#each options as option}
    <button 
      on:click={() => onSelect(option)}
      class="block w-full text-left px-4 py-3 rounded-lg dark:bg-gray-700 light:bg-gray-200 dark:hover:bg-gray-600 light:hover:bg-gray-300 dark:text-white light:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-2 dark:focus:ring-teal-400 light:focus:ring-teal-500 focus:ring-opacity-75 cursor-pointer"
    >
      {option}
    </button>
  {/each}
</div> 