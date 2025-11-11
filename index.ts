import { askGemini } from "./api/gemini";
import { startBot, sendMessageToChannel, client } from "./dcbot";
import { Elysia } from "elysia";

// Start the Discord bot
console.log("Starting Gemnbot...🤖");
await startBot();

const app = new Elysia();

// Health check endpoint
app.get("/", () => ({
    status: "Running",
    bot: client.user?.tag || "Starting...",
    guilds: client.guilds.cache.size,
    uptime: process.uptime()
}));

// Send message to Discord channel endpoint
app.get("/send/:message", async ({ params }) => {
    try {
        await sendMessageToChannel(params.message);
        return {
            status: "success",
            message: params.message,
            sent: true
        };
    } catch (err: any) {
        return {
            status: "error",
            message: params.message,
            sent: false
        }
    }
});

// AI response endpoint
app.get("/ai/:prompt", async ({ params }) => {
    try {
        const reply = await askGemini(params.prompt);
        return {
            status: "success",
            prompt: params.prompt,
            response: reply
        };
    } catch (err: any) {
        return {
            status: "error",
            prompt: params.prompt,
            error: err.message || String(err)
        }
    }
});

// Motivational response endpoint
app.get("/ai/ask/:motivation", async ({ params }) => {
    try {
        const reply = await askGemini(params.motivation);
        return {
            status: "success",
            motivation: params.motivation,
            response: reply
        };
    } catch (err: any) {
        return {
            status: "error",
            motivation: params.motivation,
            error: err.message || String(err)
        }
    }
});

// Bot statistics API
app.get("/api/stats", () => ({
    bot: {
        username: client.user?.tag,
        id: client.user?.id,
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
    },
    system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform
    }
})).listen(process.env.PORT || 3000);

console.log(`🦊 API server running at http://localhost:${app.server?.port}`);
console.log(`📡 Available endpoints:
  - GET  /                  Health check
  - GET  /send/:message     Send message to Discord
  - GET  /ai/:prompt        Ask AI
  - GET  /ai/ask/:motivation  Ask AI for motivation
  - GET  /api/stats         Bot statistics
`);