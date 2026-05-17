const Groq = require("groq-sdk");
const fs = require("fs");

const groq = new Groq({ apiKey: "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" });

async function main() {
  try {
    // Read a tiny dummy image (base64 transparent 1x1 png)
    const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is this image? Output json { type: string }." },
            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } }
          ]
        }
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0,
      response_format: { type: "json_object" },
    });
    console.log("Success:", chatCompletion.choices[0]?.message?.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
