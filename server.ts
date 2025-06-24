import { Elysia } from "elysia";
import { sendMessageToChannel } from "./dcbot";
import { askGemini } from "./gemini";

export const app = new Elysia();

app.get("/", () => "DCBot is running with Elysia!");

app.get("/send/:message", async ({ params }) => {
    await sendMessageToChannel(params.message);
    return {status: "message sent!", message: params.message};
});

app.get("/ai/:prompt", async ({ params }) => {
    const reply = await askGemini(params.prompt);
    return { prompt: params.prompt, Response: reply };
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});