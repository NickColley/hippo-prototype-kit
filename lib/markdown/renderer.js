import merge from "deepmerge";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import raw from "rehype-raw";
import sanitize from "rehype-sanitize";
import format from "rehype-format";
import html from "rehype-stringify";
import { defaultSchema } from "hast-util-sanitize";

import addClasses from "./add-classes.js";
const customSchema = merge(defaultSchema, {
  // This extension relies on being able to add custom classes to elements.
  attributes: {
    "*": ["className"],
  },
});

export default function renderMarkdown(body, options) {
  options = options || {};
  // https://github.com/syntax-tree/mdast
  let classNames = options.classNames || {};
  let sanitizeSchema = merge(customSchema, options.sanitizeSchema || {});
  let rehypePlugins = options.rehypePlugins || [];
  let remarkPlugins = options.remarkPlugins || [];

  const pipes = unified()
    // Parse markdown into a markdown remark AST
    .use(markdown)
    // Add classes to avoid needing to use global scoped styles.
    .use(addClasses, { classNames })
    // Turn the remark AST into a rehype AST, rehype works best with HTML.
    // By default it will strip HTML, we turn this off and the use 'raw' and 'sanitize'
    // in the steps after to ensure the output HTML is still safe.
    // See how the remark-html plugin works: https://github.com/remarkjs/remark-html/blob/master/index.js
    // Allow custom plugins to be passed
    .use(remarkPlugins)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(raw)
    // Allow custom plugins to be passed
    .use(rehypePlugins)
    .use(sanitize, sanitizeSchema)
    // Format the HTML so it is easy to read in the source.
    .use(format)
    // Turn the AST back into a HTML string
    .use(html);

  return pipes.processSync(body).toString();
}
