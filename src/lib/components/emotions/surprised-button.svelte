<!-- src/lib/components/emotions/surprised-button.svelte -->
<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="surprised" 
  frontColor="bg-orange-400" 
  edgeColor="bg-orange-600" 
  {onClick} 
/> 