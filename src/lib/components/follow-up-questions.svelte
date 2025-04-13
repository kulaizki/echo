<!-- src/lib/components/follow-up-questions.svelte -->
<script lang="ts">
  export let questions: string[];
  export let onSelect: (question: string) => void;
</script>

<div class="mt-6 space-y-3">
  <p class="text-lg dark:text-gray-300 light:text-gray-700 mb-4">Tell me more:</p>
  {#each questions as question}
    <button 
      on:click={() => onSelect(question)}
      class="block w-full text-left px-4 py-3 rounded-lg dark:bg-gray-700 light:bg-gray-200 dark:hover:bg-gray-600 light:hover:bg-gray-300 dark:text-white light:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-2 dark:focus:ring-teal-400 light:focus:ring-teal-500 focus:ring-opacity-75"
    >
      {question}
    </button>
  {/each}
</div> 