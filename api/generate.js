import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({
        info: "API online. Envie POST com { word: 'algo' }"
      });
    }

    const { word } = req.body;

    if (!word) {
      return res.status(400).json({ error: "Palavra ausente." });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Escreva uma frase criativa com a palavra: "${word}".`
    });

    const frase =
      response?.output?.[0]?.content?.[0]?.text ||
      "Erro ao gerar.";

    return res.status(200).json({ sentence: frase });

  } catch (error) {
    console.error("ERRO:", error);
    return res.status(500).json({ error: "Erro interno." });
  }
}
