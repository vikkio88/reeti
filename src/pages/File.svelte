<script lang="ts">
  import Header from "../components/layout/Header.svelte";

  import { open } from "@tauri-apps/plugin-dialog";
  import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";

  import MdEditor from "../components/md/MdEditor.svelte";
  import Renderer from "../components/md/Renderer.svelte";
  import { keyboardShortcuts } from "../libs/shortcuts";
  let isEditing = $state(false);
  let text = $state(`
---
  title: default
---
# Reeti

Hello from **reeti**, \`^o\` to open an existing md file.
`);

  async function loadDoc() {
    const filepath = await open({
      multiple: false,
      directory: false,
      filters: [{ extensions: ["md"], name: "markdown" }],
    });
    if (!filepath) return;

    const contents = await readTextFile(filepath, {
      baseDir: BaseDirectory.Home,
    });
    text = contents;
  }

  $effect(() => {
    const handleKeyDown = keyboardShortcuts({
      onOpen: loadDoc,
    });

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<Header>
  <div class="f1"></div>
  {#if !isEditing}
    <button class="small n-btn" onclick={() => (isEditing = true)}>Edit</button>
  {:else}
    <button class="small n-btn" onclick={() => (isEditing = false)}>
      Save
    </button>
  {/if}
  <button class="small n-btn" onclick={loadDoc}>Open</button>
</Header>

<div class="f1 body">
  {#if isEditing}
    <MdEditor bind:text />
  {:else}
    <Renderer bind:text />
  {/if}
</div>

<style>
  .body {
    padding: 0 0.5rem;
  }
</style>
