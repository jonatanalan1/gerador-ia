import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    console.log("🚀 Nova requisição recebida");
    console.log("METHOD:", req.method);
    console.log("REQ BODY RAW:", req.body); // <-- Log detalhado do body

    // Permitir apenas POST
    if (req.method !== "POST") {
      return res.status(200).json({
        info: "API online. Envie POST com { word: 'algo' }"
      });
    }

    const { word } = req.body;

    if (!word) {
      console.log("⚠ Palavra ausente no req.body");
      return res.status(400).json({ error: "Palavra ausente." });
    }

    // Verifica se a chave da OpenAI está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OPENAI_API_KEY não configurada");
      return res.status(500).json({ error: "Chave da OpenAI ausente." });
    }

    console.log("✅ OPENAI_API_KEY detectada");

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Chamada para a OpenAI
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Escreva uma frase criativa com a palavra: "${word}".`
    });

    console.log("Response recebido da OpenAI:", response);

    const frase =
      response?.output?.[0]?.content?.[0]?.text ||
      "Erro ao gerar frase.";

    return res.status(200).json({ sentence: frase });

  } catch (error) {
    console.error("❌ ERRO NA FUNÇÃO:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
}
