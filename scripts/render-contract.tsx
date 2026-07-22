import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ContactForm } from "../components/ContactForm";
import { ProjectRow } from "../components/ProjectRow";
import { projects } from "../data/site";
import GlobalError from "../app/global-error";

const contactMarkup = renderToStaticMarkup(
  createElement(ContactForm, { initialStatus: "sent" }),
);
assert.match(contactMarkup, /action="\/api\/send"/);
assert.match(contactMarkup, /method="post"/);
assert.match(contactMarkup, /Message received/);

const projectMarkup = renderToStaticMarkup(
  createElement(ProjectRow, { project: projects[0], headingLevel: "h2" }),
);
assert.match(projectMarkup, /<h2>BudgitBuddy<\/h2>/);
assert.doesNotMatch(projectMarkup, /<h3>BudgitBuddy<\/h3>/);

const errorMarkup = renderToStaticMarkup(
  createElement(GlobalError, { error: new Error("render contract"), reset: () => undefined }),
);
assert.match(errorMarkup, /<body style="[^"]*background/);
assert.match(errorMarkup, /<main id="main-content" style="[^"]*min-height/);
assert.match(errorMarkup, /An unexpected error interrupted this view/);

console.log("Rendered HTML contract passed.");
