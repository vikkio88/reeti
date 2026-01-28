<script lang="ts">
  import { parseDocument } from "./parser/frontmatter";
  import {
    // markdownFromSections,
    parsePlugins,
    type Section,
  } from "./parser/plugins";
  import Code from "./renderers/Code.svelte";
  import md from "./renderers/simpleMd";
  import Youtube from "./renderers/Youtube.svelte";
  type Props = {
    text: string;
  };
  const { text = $bindable() }: Props = $props();
  let { body } = $derived(parseDocument(text));
  const sections: Section[] = $derived(parsePlugins(body));
</script>

{#each sections as section}
  {#if section.plugin.name === "simple_md"}
    {@html md.parse(section.source)}
  {:else if section.plugin.name === "youtube"}
    <Youtube body={section.source} />
  {:else if section.plugin.name === "code"}
    <Code body={section.source} />
  {:else}
    <!-- Fallback to simple_md if no plugin -->
    {@html md.parse(section.source)}
  {/if}
{/each}
