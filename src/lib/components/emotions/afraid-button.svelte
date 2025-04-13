<!-- src/lib/components/emotions/afraid-button.svelte -->
<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="afraid" 
  frontColor="bg-indigo-500" 
  edgeColor="bg-indigo-700" 
  {onClick} 
/> 