// Magic file for Astro
// https://docs.astro.build/en/guides/middleware/#basic-usage

/** Redirect uppercase paths to lowercase for case-insensitive routing */
export function onRequest({ url, redirect }, next) {
  const lowercasePath = url.pathname.toLowerCase();
  if (url.pathname !== lowercasePath) {
    return redirect(lowercasePath + url.search, 301);
  }
  return next();
}
