<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="happy" 
  frontColor="bg-yellow-500" 
  edgeColor="bg-yellow-600" 
  {onClick} 
/> 