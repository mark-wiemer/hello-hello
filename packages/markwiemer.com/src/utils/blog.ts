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
    module: {
      default: any; // todo why does Astro need this?
      frontmatter: PostFrontmatter;
    };
  };
}

interface PostFrontmatter {
  /** Original posted ISO date (not time), e.g. `2026-04-12` */
  postDate: string;
  /** Original posted local time (not date), e.g. `20:02 PDT` or `09:32 PST`. Only PDT or PST are used. */
  postTime: string | undefined;
  /** Main heading for the article */
  postTitle: string;
  /** ISO date (not time) */
  lastUpdated?: string;
  /** Whether to list the post in the index and home page */
  listed: boolean;
  /** Medium URL where this was originally posted */
  original?: string;
  /**
   * If not provided, it's implicitly an article.
   * Only valid post types are article and notes.
   */
  postType?: "notes";
}

/** Returns all blog posts in no particular order */
export function getAllBlogPosts(): BlogPost[] {
  // path: e.g. '/src/pages/blog/content/2024-10-08-months-without-music.mdx'
  // module: object representing the module at that location
  const paths = getRawBlogPostPaths().map(([path, module]) => {
    /** e.g. '2024-10-08 months-without-music' */
    const filename = path.split("/").pop()?.replace(".mdx", "") || "";
    /** e.g. 'months-without-music' */
    const slug = filename.split("-").slice(3).join("-");

    // todo learn more about types here
    return { params: { slug }, props: { module: module as BlogPost["props"]["module"] } };
  });

  return paths;
}

// per JS sort standards:
// negative if first arg should precede second arg when sorted
// zero if equal
// positive if first arg should come after second arg when sorted
export function sortBlogPostsOldestFirst(a: PostFrontmatter, b: PostFrontmatter): number {
  return toTimestamp(a) - toTimestamp(b);
}

// todo ugh working with dates is not fun
function toDateString(f: PostFrontmatter): string {
  if (!f.postTime) return f.postDate;
  return `${f.postDate} ${f.postTime.slice(0, `00:00`.length)}`;
}

function toTimestamp(f: PostFrontmatter): number {
  return Date.parse(toDateString(f));
}
