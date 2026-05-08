//#region Klona
/**
 * Copied from https://github.com/lukeed/klona, MIT licensed,
 * copyright Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 * @template T
 * @param {T} val Input to deep clone
 * @returns {T} Deep clone of input
 */

/*
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export function klona(val) {
  let k, out, tmp;

  if (Array.isArray(val)) {
    out = Array(k = val.length);
    while (k--) {
      out[k] = (tmp = val[k]) && typeof tmp === "object" ? klona(tmp) : tmp;
    }
    return out;
  }

  if (Object.prototype.toString.call(val) === "[object Object]") {
    out = {}; // null
    for (k in val) {
      if (k === "__proto__") {
        Object.defineProperty(out, k, {
          value: klona(val[k]),
          configurable: true,
          enumerable: true,
          writable: true,
        });
      } else {
        out[k] = (tmp = val[k]) && typeof tmp === "object" ? klona(tmp) : tmp;
      }
    }
    return out;
  }

  return val;
}
//#endregion Klona

const manifestCore = {
  manifest_version: 3,
  name: "Markdown Link",
  version: "0.1.0",
  description:
    "Copies the current page URL and title as Markdown to the clipboard.",
  icons: {
    "48": "icons/border-48.png",
  },
  permissions: ["activeTab", "scripting", "clipboardWrite"],
  background: {},
  action: {
    default_title: "Copy page link as Markdown",
  },
  browser_specific_settings: {
    gecko: {
      id: "borderify@mozilla.org",
      data_collection_permissions: {
        required: ["none"],
      },
    },
  },
};

const mainScript = "main.js";

const manifestFirefox = klona(manifestCore);
manifestFirefox.background.scripts = [mainScript];

const manifestChromium = klona(manifestCore);
manifestChromium.background.service_worker = mainScript;

function writeFile(filename, value) {
  return Deno.writeTextFileSync(
    filename,
    JSON.stringify(value, null, 2),
  );
}

const manifestJson = "manifest.json";

writeFile(`${manifestJson}.firefox`, manifestFirefox);
writeFile(`${manifestJson}.chromium`, manifestChromium);
