<script lang="ts">
  import { open } from "@tauri-apps/plugin-dialog";
  import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";

  import Header from "./components/layout/Header.svelte";
  import Renderer from "./components/md/Renderer.svelte";
  import { keyboardShortcuts } from "./libs/shortcuts";
  // window.addEventListener("onkey")
  let text = $state(`
  ---
  title: yo
  ---
  [ciao](./banana)
    `);

  async function loadDoc() {
    const filepath = await open({
      multiple: false,
      directory: false,
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

<main>
  <Header>
    <div class="f1"></div>
    <button class="small n-btn" onclick={loadDoc}>Open</button>
  </Header>
  <div class="f1 body">
    <Renderer bind:text />
  </div>
</main>

<style>
  .body {
    padding: 0 0.5rem;
  }
</style>
