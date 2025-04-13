<!-- src/lib/components/emotions/emotion-button.svelte -->
<script lang="ts">
  export let emotion: string;
  export let color: string; // Tailwind color class (e.g., 'bg-green-500')
  export let onClick: () => void;

  let baseClasses = 'px-6 py-3 rounded-lg font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-150 ease-in-out';
  let hoverClasses = 'hover:opacity-90';
  let focusClasses = 'focus:ring-' + color.split('-')[1] + '-400'; // Use the color shade for focus ring

  $: buttonClasses = `${baseClasses} ${color} ${hoverClasses} ${focusClasses}`;
</script>

<button class={buttonClasses} on:click={onClick}>
  {emotion}
</button> 