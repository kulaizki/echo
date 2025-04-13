<!-- src/lib/components/emotions/disgusted-button.svelte -->
<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton 
  emotion="disgusted" 
  frontColor="bg-purple-500" 
  edgeColor="bg-purple-700" 
  {onClick} 
/> 