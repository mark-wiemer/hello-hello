const url = globalThis.location.href;
const title = document.title?.trim() ||
  document.querySelector("title")?.textContent?.trim() || url;
const markdown = `[${title || url}](${url})`;

navigator.clipboard
  .writeText(markdown)
  .then(() => {
    console.log("Copied link markdown:", markdown);
  })
  .catch((error) => {
    console.error("Failed to copy markdown:", error);
    alert(`Failed to copy markdown: ${error}`);
  });
