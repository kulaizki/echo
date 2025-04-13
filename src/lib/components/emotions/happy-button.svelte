<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="Happy" 
  frontColor="bg-yellow-400" 
  edgeColor="bg-yellow-600" 
  {onClick} 
/> 