import renderMarkdown from "./renderer.js";

export default (markdown) => {
  return renderMarkdown(markdown, {
    // Extend sanitize schema to allow classes which are required for GOV.UK Frontend components to render correctly.
    // This could probably be more restrictive in a production setting.
    sanitizeSchema: {
      tagNames: [
        "span",
        "select",
        "option",
        "button",
        "fieldset",
        "legend",
        "label",
        "input",
      ],
    },
    classNames: {
      heading(node) {
        let depth = node.depth;
        let classNames = [];
        if (depth === 1) {
          classNames.push("govuk-heading-xl");
        } else if (depth === 2) {
          classNames.push("govuk-heading-l");
        } else if (depth === 3) {
          classNames.push("govuk-heading-m");
        } else {
          classNames.push("govuk-heading-s");
        }
        classNames.push("app-!-max-width-measure");
        return classNames;
      },
      list(node) {
        let classNames = ["govuk-list"];
        classNames.push(
          node.ordered ? "govuk-list--number" : "govuk-list--bullet"
        );
        classNames.push("app-!-max-width-measure");
        return classNames;
      },
      paragraph: ["govuk-body", "app-!-max-width-measure"],
      link: ["govuk-link", "app-!-max-width-measure"],
      image: ["app-!-max-width-100"],
      strong: ["govuk-!-font-weight-bold"],
      code: ["app-pre"],
      inlineCode: ["app-code"],
      thematicBreak: [
        "govuk-section-break",
        "govuk-section-break--visible",
        "govuk-section-break--l",
        "app-!-max-width-measure",
      ],
    },
  });
};
