# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Gemnbot-ai is a Discord bot built with TypeScript and Bun runtime. It combines Discord.js for bot functionality, DisTube for music streaming, Elysia for HTTP server capabilities, and Google Gemini AI for intelligent responses.

## Architecture

### Core Components

**Entry Points:**
- `index.ts`: Main application entry point that starts the Discord bot and HTTP server
- `server.ts`: Elysia HTTP server providing REST API endpoints for external communication

**Bot Core:**
- `dcbot.ts`: Central Discord bot implementation with client initialization, DisTube integration, and interaction handling
- `reg-command.ts`: Slash command registration utility for Discord API

**Command System:**
- `commands/`: Modular command handlers for Discord slash commands
  - Music commands: `play.ts`, `pause.ts`, `resume.ts`, `stop.ts`, `connect.ts`, `disconnect.ts`
  - Moderation: `mute.ts`, `unmute.ts`, `rename.ts`
  - AI integration: `ask.ts`

**External APIs:**
- `api/gemini.ts`: Google Gemini AI integration for intelligent responses
- `api/youtube.ts`: YouTube Data API for music search functionality

### Key Integrations

**DisTube Music System:**
- Supports YouTube, Spotify, and SoundCloud playback
- Voice channel management with automatic cleanup
- Queue management and playback controls

**Multi-Platform Support:**
- Discord bot with slash commands
- HTTP REST API via Elysia server
- External API integrations (Gemini AI, YouTube Data API)

## Development Commands

### Environment Setup
```bash
# Install dependencies
bun install

# Copy environment template
cp .env.example .env
# Then configure your API keys and Discord tokens
```

### Running the Application
```bash
# Start the bot with live reload during development
bun --hot run index.ts

# Standard start (production)
bun run index.ts

# Register Discord slash commands (run after command changes)
bun run reg-command.ts
```

### Required Environment Variables
- `DISCORD_TOKEN_ID`: Discord bot token
- `DISCORD_CLIENT_ID`: Discord application client ID
- `DISCORD_CHANNEL_ID`: Default channel ID for messages
- `GEMINI_API_KEY`: Google Gemini AI API key
- `SPOTIFY_CLIENT_ID`: Spotify Web API client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify Web API client secret
- `YOUTUBE_API_KEY`: YouTube Data API v3 key

## Development Patterns

### Command Handler Structure
All Discord command handlers follow this pattern:
- Use `async function` with `ChatInputCommandInteraction` parameter
- Always `await interaction.deferReply()` first
- Implement proper error handling with try-catch blocks
- Use `interaction.editReply()` for responses after deferring
- Handle interaction timeouts gracefully

### Error Handling
The codebase implements comprehensive error handling:
- Interaction timeout protection in all command handlers
- API failure fallbacks (e.g., YouTube search with URL fallback)
- Member permission validation with proper error messages
- Voice connection state management with cleanup

### Music Integration
DisTube configuration patterns:
- Plugin-based architecture (Spotify, YouTube, YtDlp)
- Event-driven playback notifications
- Automatic voice channel cleanup on completion/empty
- Queue management with text channel feedback

## API Architecture

### HTTP Endpoints (Port 3000)
- `GET /`: Health check endpoint
- `GET /send/:message`: Send message to default Discord channel
- `GET /ai/:prompt`: Direct Gemini AI query interface

### External API Integration
- **Gemini AI**: Character-limited responses (2000 char max)
- **YouTube Data API**: Video search with fallback handling
- **Spotify/SoundCloud**: Via DisTube plugin system

## Common Development Tasks

### Adding New Commands
1. Create handler in `commands/` directory following existing patterns
2. Add command definition to `reg-command.ts`
3. Add case in `dcbot.ts` interaction handler
4. Run `bun run reg-command.ts` to register

### Testing Music Features
1. Ensure you're in a Discord voice channel
2. Bot requires proper permissions: Connect, Speak, Use Voice Activity
3. Test with both direct URLs and search queries
4. Verify cleanup behavior when queue finishes

### API Integration
- All external APIs use environment variables for keys
- Implement proper error handling for API failures
- Consider rate limiting for production deployments
- Use TypeScript interfaces for API response types

## Bot Permissions Required

**Essential Discord Permissions:**
- Send Messages, Use Slash Commands, View Channels
- Connect, Speak, Use Voice Activity (for music)
- Moderate Members (for mute/unmute commands)
- Manage Messages (for interaction management)

**Role Hierarchy:**
- Bot role must be positioned above users it needs to moderate
- Cannot moderate server administrators or owners