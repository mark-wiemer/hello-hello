# Core web technologies

Primarily HTML and CSS. For JavaScript, see [Hello JavaScript](../javascript/readme.md).

## HTML

Let's start with [Structuring content with HTML - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content) and go from there :)

- Non-tag part of an element is called `content`

### [Emphasis and importance - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Emphasis_and_importance)

`strong`, `em`, and `mark` are preferred over `b`, `i`, and `u`, respectively

### [Lists - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Lists)

`dl` is great for glossaries, use `dt` for terms and `dd` for definitions.

### [Advanced text features - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Advanced_text_features)

`q` element indicates inline quotes, but the `cite` attribute isn't very useful without custom JS or CSS.

MDN recommends using the `title` attribute for `abbr` elements, but I disagree: `title` tooltips are not accessible by default:

- Their text can't be selected for copy-pasting
- Their look and feel almost always cramped

`article` is also a valid element, ah!

`code`, `pre`, `var`, `kbd`, and `samp` are all still used

`time` is also a valid element!

### [Structuring documents - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents)

Use `section` around each `hN` element for a11y

### [Creating links - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Creating_links)

The trailing slash is important for all the reasons I knew it was important, even if I think it looks ugly. Ironically, these MDN pages don't have trailing slashes in their URLs for me!

`href="mailto:"` does work as a "Share via email" button

### [HTML images - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images)

This page calls out `title` as not accessible, like I wrote above.

### Fun facts

- Closing slash in `br` isn't necessary!
- Tags aren't actually case-sensitive

## CSS

Let's start with [CSS styling basics - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics) and go from there :)

### [CSS getting started - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Getting_started)

Shorthand rules apply in the order of `top, right, bottom, left` or, `top-bottom, left-right`

### [Attribute selectors - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Attribute_selectors)

- `~=` (tilde): exact match, surrounded by whitespace (e.g. `~=blue` matches `blue red`)
- `|=` (pipe): exact match or followed immediately by `-` (e.g. `|=zh` matches `zh-CN`)
- `^=` (caret): starts with the given value
- `$=` (dollar): ends with the given value
- `*=` (star): contains the given value

### [Pseudo-classes and pseudo-elements](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Pseudo_classes_and_elements)

`::selection` styles the selected text
