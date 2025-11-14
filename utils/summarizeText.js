// utils/summarizeText.js
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeText(text, lengthType) {
  try {
    let taskInstruction = "";
    let jsonFormat = "";

    if (lengthType === 'large') {
      taskInstruction = `
        Provide a detailed summary of the text (approximately 150-200 words).
        The summary should be comprehensive and cover the main arguments in detail.
        Then, list 5-7 key points that capture the most important ideas.
        Key points should be single, complete sentences.
      `;
      jsonFormat = `{
        "summary": "The detailed summary...",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"]
      }`;

    } else if (lengthType === 'short') {
      taskInstruction = `
        Summarize the text in 2-3 sentences (approx. 30-50 words).
        Then, list 3-5 key points that capture the most important ideas.
        Key points should be single, complete sentences.
      `;
      jsonFormat = `{
        "summary": "The 2-3 sentence summary...",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
      }`;

    } else { 
      taskInstruction = `
        Summarize the text in a concise paragraph (approx. 70-100 words).
        Then, list 3-5 key points that capture the most important ideas.
        Key points should be single, complete sentences.
      `;
      jsonFormat = `{
        "summary": "The 70-100 word summary...",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
      }`;
    }

    
    const prompt = `
      You are an expert document summarizer. Your goal is to provide a precise and neutral summary.
      
      **Rules:**
      1. Do not add any opinions or information not present in the text.
      2. Rephrase the main ideas; do not copy sentences verbatim.

      **Task:**
      ${taskInstruction}

      **Output Format:**
      Return the result STRICTLY as valid JSON matching this exact format:
      ${jsonFormat}

      If the image have any code then in summary add the code Block also
      **Text to summarize:**
      """${text.slice(0, 7000)}"""
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      
      temperature: 0.5, 
    });

    const content = response.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        summary: content.split("keyPoints")[0] || content, 
        keyPoints: [],
      };
    }

    return parsed;
  } catch (error) {
    console.error("Error in summarizeText util:", error);
    throw new Error("Failed to summarize text");
  }
}

module.exports = summarizeText;