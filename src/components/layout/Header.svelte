<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<header class="f spb aic pd">
  {#if children}
    {@render children()}
  {/if}
</header>

<style>
  header {
    background-color: var(--main-bg-faint-color);
  }
</style>
