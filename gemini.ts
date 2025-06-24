export async function askGemini(prompt: string): Promise<string> {
    const geminiApiKey = process.env.GEMINI_API_KEY;
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{parts: [{text: `${prompt}. Do not more than 2000 words.`}]}],
        })
    });

    // Check if the response is ok
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error from Gemini API: ${errorText}`);
    }
    const data = await response.json();
	return data.candidates[0]?.content?.parts[0].text || "No response";
}