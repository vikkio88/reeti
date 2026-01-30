<script lang="ts">
  import { tick } from "svelte";
  import Renderer from "./Renderer.svelte";
  import {
    appendToText,
    csFromTextArea,
    csFromTextAreaOrUndefined,
    CURSOR_POSITION,
    IMAGE_PATTERN,
    LINK_PATTERN,
    moveCursor,
    PLACEHOLDER,
    PLUGIN_PATTERN,
    substringSelection,
    wrapSelection,
  } from "./editor/libs";

  type Props = {
    text: string;
    placeholder?: string;
  };

  let {
    text = $bindable(""),
    placeholder = "Add some markdown text...",
  }: Props = $props();

  let textarea: HTMLTextAreaElement | undefined = $state();

  const addImage = async () => {
    const selection = csFromTextAreaOrUndefined(textarea!);
    if (!selection) {
      text = appendToText(text, IMAGE_PATTERN, "Image");
    } else {
      text = wrapSelection(selection, text, IMAGE_PATTERN, "Image");
    }
    text = text.replace(CURSOR_POSITION, "URL").replace(PLACEHOLDER, "");
    await tick();

    const cursorPos = substringSelection(text, "URL");
    if (!cursorPos) return;

    moveCursor(textarea!, cursorPos);
  };

  const addLink = async () => {
    const selection = csFromTextArea(textarea!);
    if (selection.start === selection.end) {
      text = appendToText(text, LINK_PATTERN, "LABEL");
    } else {
      const newValue = wrapSelection(selection, text, LINK_PATTERN);
      text = newValue;
    }
    text = text.replace(CURSOR_POSITION, "URL").replace(PLACEHOLDER, "");
    await tick();
    const cursorPos = substringSelection(text, "URL");
    if (!cursorPos) return;

    moveCursor(textarea!, cursorPos);
  };

  const addPluginBlock = async () => {
    const selection = csFromTextAreaOrUndefined(textarea!);
    if (!selection) {
      text = appendToText(text, PLUGIN_PATTERN, "Plugin body");
    } else {
      text = wrapSelection(selection, text, PLUGIN_PATTERN);
    }

    text = text.replace(CURSOR_POSITION, "PLUGIN_NAME");
    await tick();

    const cursorPos = substringSelection(text, "PLUGIN_NAME");
    if (!cursorPos) return;

    moveCursor(textarea!, cursorPos);
  };

  let showPreview = $state(false);
</script>

<div class="commands">
  <div class="editorCommands">
    <button class="n-btn" disabled={showPreview} onclick={addImage}>🖼️</button>
    <button class="n-btn" disabled={showPreview} onclick={addLink}>🔗</button>
    <button class="n-btn" disabled={showPreview} onclick={addPluginBlock}>
      🔌
    </button>
  </div>

  <button class="n-btn" onclick={() => (showPreview = !showPreview)}>
    {#if showPreview}
      📝
    {:else}
      👁️
    {/if}
  </button>
</div>

{#if showPreview}
  <Renderer bind:text />
{:else}
  <textarea bind:this={textarea} bind:value={text} {placeholder}></textarea>
{/if}

<style>
  .commands {
    width: 100%;
    background-color: var(--black-1-color);
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .editorCommands {
    flex: 5;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
  textarea {
    width: 100%;
    height: 90%;
    resize: none;
    border: none;
    outline: none;
    padding: 1rem;
    font-family: inherit;
    font-size: inherit;
    background-color: var(--black-2-color);
    color: var(--main-font-color);
  }
</style>
