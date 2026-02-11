# 🤖 GemnBot AI - Advanced Discord Bot

A powerful, feature-rich Discord bot built with modern technologies, offering AI assistance, music streaming, and server moderation capabilities.

## 📋 Table of Contents

- [🚀 Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [📁 Project Structure](#project-structure)
- [⚙️ Environment Setup](#environment-setup)
- [🏃‍♂️ Quick Start](#quick-start)
- [🎵 Music Commands](#music-commands)
- [🤖 AI Commands](#ai-commands)
- [👮‍♂️ Moderation Commands](#moderation-commands)
- [🔧 Utility Commands](#utility-commands)
- [🌐 Web API Endpoints](#web-api-endpoints)
- [🚀 Deployment Guide](#deployment-guide)
- [🔧 Development](#development)
- [📝 Contributing](#contributing)

## Features

### 🎵 **Music Streaming**
- **Multi-platform support**: YouTube, Spotify, SoundCloud
- **Smart search**: Automatic YouTube search for song titles
- **Queue management**: Play, pause, resume, stop functionality
- **Voice channel management**: Auto-connect and disconnect

### 🤖 **AI Assistant**
- **Gemini AI Integration**: Powered by Google's Gemini 2.0 Flash
- **Natural language processing**: Ask questions and get intelligent responses
- **Daily motivation**: Indonesian motivational quotes feature (`kata-kata-hari-ini`)
- **Response optimization**: Automatic 2000 character limit for Discord compatibility

### 👮‍♂️ **Server Moderation**
- **Timeout system**: Mute users with customizable duration (1-40320 minutes)
- **Permission management**: Role hierarchy and permission validation
- **Nickname management**: Self and admin nickname changing
- **Comprehensive error handling**: Robust interaction management

### 🌐 **Web API**
- **RESTful endpoints**: HTTP API for external integrations
- **Real-time messaging**: Send messages via web requests
- **AI query endpoint**: Access AI features via HTTP

### 📊 **Enhanced Logging System**
- **Comprehensive command tracking**: Logs all command executions with timestamps
- **User activity monitoring**: Tracks username, user ID, and guild information
- **Success/Error status tracking**: Detailed logging of command outcomes
- **Structured console output**: Enhanced readability with formatted log messages
- **Real-time debugging**: Immediate feedback for development and troubleshooting

## Tech Stack

- <img src="https://bun.sh/logo.svg" alt="Bun Logo" width="24" height="24" style="vertical-align:middle;"> **Bun**: Ultra-fast JavaScript runtime and package manager
- <img src="https://elysiajs.com/assets/elysia.svg" alt="Elysia Logo" width="24" height="24" style="vertical-align:middle;"> **Elysia**: High-performance web framework for Bun
- <img src="https://www.svgrepo.com/show/374146/typescript-official.svg" alt="TypeScript Logo" width="24" height="24" style="vertical-align:middle;"> **TypeScript**: Type-safe JavaScript with enhanced developer experience
- **Discord.js v14**: Latest Discord API wrapper with full feature support
- **DisTube**: Advanced music bot framework with multi-platform support
- **Google Gemini AI**: State-of-the-art AI language model
- **Custom Logger Utility**: Enhanced console logging with timestamps and command tracking

## Project Structure

```
gemnbot-ai/
├── 📁 api/                    # External API integrations
│   ├── gemini.ts             # Google Gemini AI API client
│   └── youtube.ts            # YouTube search functionality
├── 📁 commands/              # Discord slash commands
│   ├── ask.ts               # AI question & motivation commands
│   ├── join.ts              # Voice channel connection
│   ├── leave.ts             # Voice channel disconnection
│   ├── mute.ts             # User timeout/mute functionality
│   ├── unmute.ts           # User unmute functionality
│   ├── pause.ts            # Music pause control
│   ├── play.ts             # Music playback with search
│   ├── rename.ts           # Nickname management
│   ├── resume.ts           # Music resume control
│   └── stop.ts             # Music stop control
├── 📁 utility/               # Utility functions and helpers
│   └── logger.ts            # Enhanced logging system with timestamps
├── dcbot.ts                 # Core Discord bot logic & event handlers
├── index.ts                 # Application entry point
├── reg-command.ts          # Slash command registration utility
├── package.json            # Dependencies & project metadata
└── tsconfig.json           # TypeScript configuration
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Discord Bot Configuration
DISCORD_TOKEN_ID=your_discord_token_id
DISCORD_CLIENT_ID=your_discord_application_id
DISCORD_CHANNEL_ID=your_default_channel_id_for_messages

# Spotify Integration (Optional - for Spotify URL support)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Getting API Keys

1. **Discord Bot Token**:
   - Visit [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application → Bot → Copy token

2. **Spotify Credentials** (Optional):
   - Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create app → Copy Client ID & Secret

3. **Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate API key

## Quick Start

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Clone and setup**:
   ```bash
   git clone <your-repository-url>
   cd gemnbot-ai
   bun install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Register Discord commands**:
   ```bash
   bun run reg-command.ts
   ```

5. **Start the bot**:
   ```bash
   # Production
   bun run index.ts
   
   # Development (with hot reload)
   bun --hot run index.ts
   ```


## Music Commands

### `/play <query>`
**Play music from multiple sources**

**Supported Input Types:**
- **Song titles**: `never gonna give you up`, `imagine dragons believer`
- **YouTube URLs**: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **Spotify URLs**: `https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`
- **SoundCloud URLs**: `https://soundcloud.com/artist/track`

**Features:**
- 🔍 Automatic YouTube search for song titles
- ✅ Direct URL playback support
- 🎵 Queue management with DisTube
- ⚡ Fast response with search status updates

### Other Music Controls
- `/pause` - Pause current playback
- `/resume` - Resume paused music
- `/stop` - Stop music and clear queue
- `/join` - Connect to your voice channel
- `/leave` - Leave voice channel

**Requirements:**
- Must be in a voice channel
- Bot needs voice channel permissions
- YouTube Data API access (configured automatically)

## AI Commands

### `/ask <prompt>`
**Ask questions to Gemini AI assistant**

**Examples:**
```
/ask What is the capital of France?
/ask Explain quantum computing in simple terms
/ask Write a Python function to sort a list
```

**Features:**
- 🧠 Powered by Google Gemini 2.0 Flash
- 📝 Intelligent responses with context awareness
- 🎯 Optimized for Discord (2000 character limit)
- 👤 Shows username in response format

### `/kata-kata-hari-ini`
**Get daily motivational quotes in Indonesian**

**Features:**
- 🌅 Daily inspiration in Indonesian language
- 💪 Motivational content generation
- 🎯 Culturally relevant quotes

## Moderation Commands

### `/mute <user> [duration] [reason]`
**Temporarily mute users with timeout**

**Parameters:**
- `user`: **Required** - User to mute (@username)
- `duration`: **Optional** - Minutes (1-40320, default: 10)
- `reason`: **Optional** - Reason for muting

**Examples:**
```
/mute user:@username duration:30 reason:spamming
/mute user:@troublemaker duration:60
/mute user:@user
```

### `/unmute <user> [reason]`
**Remove timeout from users**

**Parameters:**
- `user`: **Required** - User to unmute
- `reason`: **Optional** - Reason for unmuting

**Permission Requirements:**
- ✅ **Moderate Members** permission required
- ✅ Bot role must be higher than target user
- ✅ Cannot mute server administrators/owners
- ✅ Proper role hierarchy validation

## Utility Commands

### `/rename <nickname> [user]`
**Change server nicknames**

**Self-rename:**
```
/rename nickname:"New Nickname"
```

**Admin rename (requires permissions):**
```
/rename nickname:"New Name" user:@target_user
```

**Permission Requirements:**
- **Self-rename**: No special permissions needed
- **Admin rename**: `ManageNicknames` permission or moderator role
- **Role hierarchy**: Cannot rename users with equal/higher roles

**Features:**
- 🔒 Comprehensive permission validation
- 📏 32-character nickname limit enforcement
- 👑 Server owner protection
- 🛡️ Role hierarchy respect

### `/ping`
**Simple connectivity test**
- Returns "Pong!" to verify bot responsiveness

## Web API Endpoints

The bot includes an HTTP API server running on port `PORT` (default `3000`):

### `GET /`
**Health check endpoint**
```
Response (JSON example):
{
  "status": "Running",
  "bot": "Gemnbot#1234",
  "guilds": 3,
  "uptime": 123.45
}
```

### `GET /send/:message`
**Send message to default channel**
```bash
curl http://localhost:3000/send/Hello%20World
```

### `GET /ai/:prompt`
**Query Gemini AI via HTTP**
```bash
curl http://localhost:3000/ai/What%20is%20TypeScript
```

### `GET /ai/ask/:motivation`
**Get motivational quote via HTTP**
```bash
curl http://localhost:3000/ai/ask/motivation
```

### `GET /api/stats`
**Bot and system statistics**
```
Response (JSON example):
{
  "bot": {
    "username": "Gemnbot#1234",
    "id": "1234567890",
    "guilds": 3,
    "users": 42
  },
  "system": {
    "uptime": 123.45,
    "memory": { /* process.memoryUsage() */ },
    "platform": "win32"
  }
}
```

## Deployment Guide

### 🚄 Railway (Recommended)
**Fast and easy deployment**

1. Create `railway.toml`:
   ```toml
   [build]
   builder = "nixpacks"
   
   [deploy]
   startCommand = "bun run index.ts"
   ```

2. Connect GitHub repository to Railway
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### 🐳 Docker Deployment
**Containerized deployment**

1. Create `Dockerfile`:
   ```dockerfile
   FROM oven/bun:1
   
   WORKDIR /app
   COPY package.json bun.lock* ./
   RUN bun install --frozen-lockfile
   
   COPY . .
   EXPOSE 3000
   
   CMD ["bun", "run", "index.ts"]
   ```

2. Build and run:
   ```bash
   docker build -t gemnbot-ai .
   docker run -d --env-file .env -p 3000:3000 gemnbot-ai
   ```

### 🖥️ VPS Deployment
**Traditional server deployment**

1. **Install Bun on server**:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Setup application**:
   ```bash
   git clone <repository>
   cd gemnbot-ai
   bun install
   ```

3. **Create systemd service** (`/etc/systemd/system/gemnbot.service`):
   ```ini
   [Unit]
   Description=GemnBot AI Discord Bot
   After=network.target
   
   [Service]
   Type=simple
   User=your-user
   WorkingDirectory=/path/to/gemnbot-ai
   ExecStart=/home/your-user/.bun/bin/bun run index.ts
   Restart=always
   RestartSec=10
   Environment=NODE_ENV=production
   
   [Install]
   WantedBy=multi-user.target
   ```

4. **Start service**:
   ```bash
   sudo systemctl enable gemnbot
   sudo systemctl start gemnbot
   ```

### ☁️ Other Platforms
- **Heroku**: Add `Procfile` with `web: bun run index.ts`
- **DigitalOcean App Platform**: Use `app.yaml` configuration
- **Vercel**: Configure for serverless deployment
- **AWS/GCP**: Use container services or compute instances

## Development

### 🏃‍♂️ **Development Mode**
```bash
# Hot reload during development
bun --hot run index.ts

# Register new commands during development
bun run reg-command.ts
```

### 🧪 **Testing Commands**
1. Invite bot to test server with proper permissions
2. Run `/ping` to verify connectivity
3. Test each command category systematically
4. Monitor console logs for errors

### 📊 **Enhanced Logging & Monitoring**
- **Comprehensive command tracking**: Every command execution is logged with detailed context
- **Structured log format**: Timestamp, command name, user info, guild ID, and execution status
- **Success/Error tracking**: Clear indication of command outcomes for debugging
- **Real-time monitoring**: Live console output for development and production debugging
- **User activity insights**: Track command usage patterns and user interactions

**Example log output:**
```
[2024-01-15 14:30:25.123] [INFO] CMD:ask USER:JohnDoe(123456789) GUILD:987654321 STATUS:START - Command started
[2024-01-15 14:30:27.456] [INFO] CMD:ask USER:JohnDoe(123456789) GUILD:987654321 STATUS:SUCCESS - Command completed successfully
[2024-01-15 14:30:30.789] [ERROR] CMD:play USER:JaneSmith(987654321) GUILD:123456789 STATUS:ERROR - Command failed ERROR:Voice channel not found
```

- **Error handling**: User-friendly error messages with detailed logging
- **Interaction timeout protection**: Robust handling of Discord API limitations
- **API rate limit awareness**: Smart request management

### 🔄 **Adding New Commands**
1. Create command handler in `commands/` directory
2. Add command definition in `reg-command.ts`
3. Register command in `dcbot.ts` interaction handler
4. Run `bun run reg-command.ts` to update Discord

## Contributing

### 🤝 **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 **Contribution Guidelines**
- Follow TypeScript best practices
- Add proper error handling
- Include JSDoc comments for new functions
- Test all Discord interactions thoroughly
- Update README for new features

### 🐛 **Bug Reports**
- Use GitHub Issues with detailed descriptions
- Include error logs and reproduction steps
- Specify environment details (OS, Bun version, etc.)

### ✨ **Feature Requests**
- Open GitHub Issues with feature proposals
- Explain use cases and expected behavior
- Consider implementation complexity

---

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Discord.js** community for excellent documentation
- **Bun** team for the amazing runtime
- **Google** for Gemini AI API access
- **DisTube** for music bot capabilities
- All contributors and users of this bot

---

<div align="center">

**Made with ❤️ and TypeScript**

[⭐ Star this repo](https://github.com/your-username/gemnbot-ai) • [🐛 Report Bug](https://github.com/your-username/gemnbot-ai/issues) • [💡 Request Feature](https://github.com/your-username/gemnbot-ai/issues)

</div>
