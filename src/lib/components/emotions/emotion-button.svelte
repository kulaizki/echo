<script lang="ts">
  export let emotion: string;
  export let frontColor: string; 
  export let edgeColor: string; 
  export let textColor: string = 'text-white'; 
  export let onClick: () => void;

  let pushableClasses = 'relative border-none bg-transparent p-0 cursor-pointer outline-offset-4 transition-all duration-150 ease-in-out active:duration-75 focus:outline-none';
  let hoverClasses = 'hover:brightness-110';
  let activeClasses = 'active:translate-y-[2px]';

  let shadowClasses = 'absolute inset-0 rounded-lg bg-black/30 transform translate-y-[3px] transition-transform duration-150 ease-in-out group-active:translate-y-[1px]';

  let edgeClasses = `absolute inset-0 rounded-lg ${edgeColor}`;

  let frontClasses = `relative block w-full h-full px-4 py-2 rounded-lg ${frontColor} ${textColor} text-lg font-semibold border-2 border-black/10 transform -translate-y-[4px] transition-transform duration-150 ease-in-out group-hover:-translate-y-[5px] group-active:-translate-y-[1px]`;

  let focusRingColor = frontColor.replace('bg-', 'focus:ring-').split('-')[0] + '-' + frontColor.split('-')[1]; // Derive ring color
  let focusClasses = `focus:ring-2 ${focusRingColor} focus:ring-offset-2 dark:focus:ring-offset-gray-950 light:focus:ring-offset-gray-100`;

  $: finalPushableClasses = `${pushableClasses} ${hoverClasses} ${activeClasses} ${focusClasses} group`;
</script>

<button class={finalPushableClasses} on:click={onClick}>
  <span class={shadowClasses}></span>
  <span class={edgeClasses}></span>
  <span class={frontClasses}>
    {emotion}
  </span>
</button> 