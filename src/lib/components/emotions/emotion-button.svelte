<script lang="ts">
  export let emotion: string;
  export let color: string; 
  export let onClick: () => void;

  let baseClasses = 'px-6 py-3 rounded-lg font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-150 ease-in-out';
  let hoverClasses = 'hover:opacity-90';
  let focusClasses = 'focus:ring-' + color.split('-')[1] + '-400'; 

  $: buttonClasses = `${baseClasses} ${color} ${hoverClasses} ${focusClasses}`;
</script>

<button class={buttonClasses} on:click={onClick}>
  {emotion}
</button> 