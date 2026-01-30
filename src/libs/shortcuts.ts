export function keyboardShortcuts(params: { onOpen?: () => void }) {
  return (event: KeyboardEvent) => {
    // Open
    if ((event.ctrlKey || event.metaKey) && event.key === "o") {
      event.preventDefault();
      params.onOpen?.();
    }
  };
}
