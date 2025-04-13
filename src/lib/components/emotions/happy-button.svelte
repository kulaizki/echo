<script lang="ts">
  import EmotionButton from './emotion-button.svelte';
  export let onClick: () => void;
</script>

<EmotionButton emotion="Happy" color="bg-yellow-400" {onClick} /> 