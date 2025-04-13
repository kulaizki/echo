<!-- src/lib/components/emotions/sad-button.svelte -->
<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton emotion="Sad" color="bg-blue-500" {onClick} /> 