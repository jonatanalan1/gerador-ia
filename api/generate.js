import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    console.log("🚀 Nova requisição recebida");
    console.log("METHOD:", req.method);

    if (req.method !== "POST") {
      return res.status(200).json({
        info: "API online. Envie POST com { word: 'algo' }"
      });
    }

    // Parse seguro do body
    let bodyText = await req.text();
    let body;
    try {
      body = JSON.parse(bodyText || "{}");
    } catch {
      body = {};
    }

    console.log("REQ BODY PARSED:", body);

    const { word } = body;

    if (!word) {
      console.log("⚠ Palavra ausente");
      return res.status(400).json({ error: "Palavra ausente." });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OPENAI_API_KEY não configurada");
      return res.status(500).json({ error: "Chave da OpenAI ausente." });
    }

    console.log("✅ OPENAI_API_KEY detectada");

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Escreva uma frase criativa com a palavra: "${word}".`
    });

    const frase =
      response?.output?.[0]?.content?.[0]?.text || "Erro ao gerar frase.";

    console.log("✅ Frase gerada:", frase);

    return res.status(200).json({ sentence: frase });

  } catch (error) {
    console.error("❌ ERRO NA FUNÇÃO:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
}
