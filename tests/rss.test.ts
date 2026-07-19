import { describe, expect, it } from "vitest";

import { escapeXml, wrapCdata } from "../lib/xml";

describe("RSS XML safety", () => {
  it("escapes XML structural characters", () => {
    expect(escapeXml(`A&B <tag> "quote" 'apostrophe'`)).toBe("A&amp;B &lt;tag&gt; &quot;quote&quot; &apos;apostrophe&apos;");
  });

  it("splits CDATA terminators so metadata cannot break the feed", () => {
    expect(wrapCdata("before ]]> after")).toBe("<![CDATA[before ]]]]><![CDATA[> after]]>");
  });
});
