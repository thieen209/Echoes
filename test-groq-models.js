const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: "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" });

async function main() {
  const models = await groq.models.list();
  console.log(models.data.map(m => m.id));
}

main();
