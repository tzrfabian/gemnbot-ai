export async function askGemini(prompt: string): Promise<string> {
    const geminiApiKey = process.env.GEMINI_API_KEY;
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}],
        })
    });

    const data = await response.json();
	return data.candidates[0]?.content?.parts[0].text || "No response";
}