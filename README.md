# Gemnbot-ai

### Tech Stack

- <img src="https://bun.sh/logo.svg" alt="Bun Logo" width="24" height="24" style="vertical-align:middle;"> **Bun**: JavaScript runtime for fast, modern development.
- <img src="https://elysiajs.com/assets/elysia.svg" alt="Elysia Logo" width="24" height="24" style="vertical-align:middle;"> **Elysia**: Fast, modern web framework for building APIs with Bun.
- <img src="https://www.svgrepo.com/show/374146/typescript-official.svg" alt="Elysia Logo" width="24" height="24" style="vertical-align:middle;"> **TypeScript**: Strongly typed programming language that builds on JavaScript.

## Documentation


### Project Structure

- `index.ts`: Main entry point of the application.
- `README.md`: Project documentation.
- `package.json`: Project metadata and scripts.
- Other source files and configuration as needed.

### Usage

1. **Install dependencies**  
    Run `bun install` to install all required packages.

2. **Run the project**  
    Use `bun run index.ts` to start the application.
    Or
    Use `bun --hot run index.ts` to running & do live updates when you doing changes.

### Requirements

- **Bun** v1.2.4 or later ([bun.sh](https://bun.sh))
- **Elysia** (included as a dependency)
- **TypeScript** (included as a dependency)


# Command Instruction

## Music Commands

### Play Command Usage

The `/play` command now supports both song titles and direct URLs:

#### Supported Formats:

##### 1. Song Title Search
- `/play never gonna give you up`
- `/play imagine dragons believer`
- `/play taylor swift shake it off`

The bot will automatically search YouTube and play the first result.

##### 2. Direct URLs
- **YouTube**: `/play https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **Spotify**: `/play https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`
- **SoundCloud**: `/play https://soundcloud.com/artist/track`

#### How it works:
1. If you provide a URL, the bot plays it directly
2. If you provide a song title, the bot:
   - Shows "🔍 Searching YouTube..."
   - Uses YouTube Data API to find the best match
   - Plays the found video

#### Requirements:
- You must be in a voice channel
- The bot needs YouTube Data API access (already configured)
- Supports Spotify and SoundCloud links through DisTube plugins

#### Error Handling:
- If no results found: "❌ No results found on YouTube for your search"
- If API fails: Falls back to error message with suggestion to use direct URL
- All interaction timeouts are properly handled

### Other Music Commands:
- `/pause` - Pause current song
- `/resume` - Resume paused song
- `/stop` - Stop music and leave voice channel
- `/connect` - Connect bot to your voice channel
- `/disconnect` - Disconnect bot from voice channel

## Moderation Commands

### Mute/Unmute Commands

#### Command Usage:

##### Mute Command:
```
/mute user:@username duration:10 reason:spamming
```
- **user**: Required - The user to mute
- **duration**: Optional - Minutes (1-40320, default: 10)
- **reason**: Optional - Reason for muting

##### Unmute Command:
```
/unmute user:@username reason:appeal accepted
```
- **user**: Required - The user to unmute  
- **reason**: Optional - Reason for unmuting

#### Bot Permissions Required:

Make sure your bot has these permissions in Discord:
- ✅ **Moderate Members** (required for timeout/mute)
- ✅ **Send Messages**
- ✅ **Use Slash Commands**
- ✅ **View Channels**

#### Permission Requirements:
- Bot's role must be higher than the user being muted
- Bot cannot mute server admins/owners
- User executing command must have "Moderate Members" permission

#### Error Handling & Troubleshooting:

All interaction timeout errors have been fixed with:
- ✅ Proper try-catch blocks around Discord API calls
- ✅ Improved interaction timeout handling
- ✅ Better member fetching using `fetch()` instead of cache
- ✅ Enhanced permission validation
- ✅ Safer interaction responses with state checking

#### Common Issues & Solutions:

##### "Unknown interaction" Error:
✅ **Fixed** - Added proper error handling and interaction state checking

##### "InteractionNotReplied" Error:
✅ **Fixed** - Added checks for interaction state before responding

##### "User not found" Error:
✅ **Fixed** - Now uses `fetch()` instead of cache for better reliability

##### Permission Errors:
- Ensure bot has "Moderate Members" permission
- Check bot role hierarchy (must be above target user)
- Verify user permissions for command execution

## AI Commands

### Ask Command:
- `/ask` - Ask questions to the AI assistant powered by Gemini API
- Supports natural language queries and provides intelligent responses
- Includes proper error handling for API timeouts

### Contributing

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a clear description.
