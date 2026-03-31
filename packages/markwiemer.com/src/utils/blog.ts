function getRawBlogPostPaths() {
  const glob = import.meta.glob("/src/pages/blog/content/*.mdx", { eager: true });
  return Object.entries(glob);
}

interface BlogPost {
  // This must be named `params` to work with Astro's dynamic routing
  params: {
    /** Slug for URL, e.g. `'months-without-music'` */
    // LHS here must be named `slug` to match `[slug].astro` filename
    slug: string;
  };
  // This must be named `props` to work with Astro
  props: {
    /** Object representing the module at that location */
    module: any;
  };
}

export function getBlogPostPaths(): BlogPost[] {
  // path: e.g. '/src/pages/blog/content/2024-10-08 months-without-music.mdx'
  // module: object representing the module at that location
  const paths = getRawBlogPostPaths().map(([path, module]) => {
    /** e.g. '2024-10-08 months-without-music' */
    const filename = path.split("/").pop()?.replace(".mdx", "") || "";
    /** e.g. 'months-without-music' */
    const slug = filename.split(" ").slice(1).join("-");

    return { params: { slug }, props: { module } };
  });

  return paths;
}

export function getPreface(
  postDate: string,
  postTime?: string,
  lastUpdated?: string,
  postType?: string,
): string {
  let preface = `${postDate}${postTime ? `, ${postTime}.` : "."}`;

  preface += lastUpdated ? ` Last updated ${lastUpdated}.` : "";
  preface +=
    postType === "notes"
      ? ` These are personal notes, subject to change. None of this is legal advice.`
      : "";

  return preface;
}
