function getRawBlogPostPaths() {
  const glob = import.meta.glob("/src/pages/blog/content/*.mdx", { eager: true });
  return Object.entries(glob);
}

export function getBlogPostPaths() {
  const paths = getRawBlogPostPaths().map(([path, module]) => {
    // Extract filename from path:
    // './content/2024-10-08 months-without-music.mdx'
    // -> '2024-10-08 months-without-music'
    const filename = path.split("/").pop()?.replace(".mdx", "") || "";
    // Extract slug from filename:
    // '2024-10-08 months-without-music' -> 'months-without-music'
    const slug = filename.split(" ").slice(1).join("-");

    return {
      params: { slug },
      props: {
        module,
        filename,
      },
    };
  });

  return paths;
}
