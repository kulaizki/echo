<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="Angry" 
  frontColor="bg-red-500" 
  edgeColor="bg-red-700" 
  {onClick} 
/> 