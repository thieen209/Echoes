const apiKey = "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";

async function test() {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: "hello" }],
    })
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text);
}
test();
