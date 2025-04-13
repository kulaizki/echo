<!-- src/lib/components/emotions/angry-button.svelte -->
<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton emotion="Angry" color="bg-red-500" {onClick} /> 