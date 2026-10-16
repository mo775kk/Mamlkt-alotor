import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("ai-worker/src/index.js", "utf8");
const { default: worker } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
const env = { ALLOWED_ORIGINS: "https://mo775kk.github.io", OPENAI_API_KEY: "test-secret", OPENAI_MODEL: "test-model" };
const req = (path, { method = "GET", origin = "https://mo775kk.github.io", body } = {}) =>
  new Request("https://worker.example" + path, {
    method,
    headers: { Origin: origin, ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {})
  });
const json = async (res) => ({ status: res.status, body: await res.json(), headers: res.headers });

{
  const res = await json(await worker.fetch(req("/health"), env));
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.configured, true);
  console.log("PASS /health reports configured service");
}
{
  const res = await json(await worker.fetch(req("/wrong"), env));
  assert.equal(res.status, 404);
  console.log("PASS unknown route returns 404");
}
{
  const res = await json(await worker.fetch(req("/api/ask", { method: "POST", origin: "https://evil.example", body: { question: "hello" } }), env));
  assert.equal(res.status, 403);
  assert.equal(res.headers.get("access-control-allow-origin"), null);
  console.log("PASS unapproved browser origin is rejected");
}
{
  const noKey = { ALLOWED_ORIGINS: env.ALLOWED_ORIGINS };
  const res = await json(await worker.fetch(req("/api/ask", { method: "POST", body: { question: "عطر" } }), noKey));
  assert.equal(res.status, 503);
  console.log("PASS missing server secret fails closed");
}
{
  const res = await json(await worker.fetch(req("/api/ask", { method: "POST", body: "{" }), env));
  assert.equal(res.status, 400);
  console.log("PASS malformed JSON is rejected");
}
{
  const res = await json(await worker.fetch(req("/api/ask", { method: "POST", body: { question: "   " } }), env));
  assert.equal(res.status, 400);
  console.log("PASS empty question is rejected");
}
{
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    const sent = JSON.parse(options.body);
    assert.equal(sent.store, false);
    return new Response(JSON.stringify({ output: [{ content: [{ type: "output_text", text: JSON.stringify({ answer: "أنصحك بعطر خشبي.", recommendedProductIds: ["p1", "fake", "p1"] }) }] }] }), { status: 200 });
  };
  try {
    const res = await json(await worker.fetch(req("/api/ask", { method: "POST", body: {
      question: "أريد عطرا خشبيا",
      products: [{ id: "p1", nameAr: "عطر تجريبي" }]
    } }), env));
    assert.equal(res.status, 200);
    assert.equal(res.body.answer, "أنصحك بعطر خشبي.");
    assert.deepEqual(res.body.recommendedProductIds, ["p1"]);
    console.log("PASS AI response is parsed and unknown/duplicate product IDs are removed");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
{
  const tooLarge = "x".repeat(45001);
  const res = await json(await worker.fetch(req("/api/ask", { method: "POST", body: tooLarge }), env));
  assert.equal(res.status, 413);
  console.log("PASS oversized request is rejected");
}
console.log("AI Worker tests passed.");
