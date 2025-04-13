<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="sad" 
  frontColor="bg-blue-500" 
  edgeColor="bg-blue-700" 
  {onClick} 
/> 