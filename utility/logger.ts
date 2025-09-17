export interface LogContext {
    commandName?: string;
    username?: string;
    userId?: string;
    guildId?: string;
    status?: 'SUCCESS' | 'ERROR'| 'START';
    error?: string;
    additionalInfo?: any;
}

// Logger class
export class Logger {
    private static formatTimeStamp(): string {
        return new Date().toISOString().replace('T', ' ').replace('Z', '');
    }
    
    // Format the message for logging
    private static formatMessage(level: string, message: string, context: LogContext): string {
        const timestamp = this.formatTimeStamp();
        let logParts = [`[${timestamp}]`, `[${level}]`];

        if(context?.commandName) {
            logParts.push(`[Command: ${context.commandName}]`);
        }

        if(context?.username && context?.userId) {
            logParts.push(`[User: ${context.username} (${context.userId})]`);
        }

        if(context?.guildId) {
            logParts.push(`[Guild: ${context.guildId}]`);
        }

        if(context?.status) {
            logParts.push(`[Status: ${context.status}]`);
        }

        logParts.push(`- ${message}`);

        if(context?.error) {
            logParts.push(`[Error: ${context.error}]`);
        }

        if(context?.additionalInfo) {
            logParts.push(`[Additional Info: ${JSON.stringify(context.additionalInfo)}]`);
        }

        return logParts.join(' ');
    }

    static info(message: string, context: LogContext) {
        console.log(this.formatMessage('INFO', message, context));
    }

    static error(message: string, context: LogContext) {
        console.error(this.formatMessage('ERROR', message, context));
    }

    static warn(message: string, context: LogContext) {
        console.warn(this.formatMessage('WARN', message, context));
    }

    static debug(message: string, context: LogContext) {
        console.debug(this.formatMessage('DEBUG', message, context));
    }

    // Convenience methods for command logging
    static commandStart(commandName: string, username: string, userId: string, guildId: string, additionalInfo?: any) {
        this.info(`Command ${commandName} started`, {
            commandName,
            username,
            userId,
            guildId,
            status: 'START',
            additionalInfo,
        });
    }

    static commandSuccess(commandName: string, username: string, userId: string, guildId: string, additionalInfo?: any) {
        this.info(`Command ${commandName} completed successfully`, {
            commandName,
            username,
            userId,
            guildId,
            status: 'SUCCESS',
            additionalInfo,
        });
    }

    static commandError(commandName: string, username: string, userId: string, guildId: string, error: Error, additionalInfo?: any) {
        this.error(`Command ${commandName} failed`, {
            commandName,
            username,
            userId,
            guildId,
            status: 'ERROR',
            error: error.message,
            additionalInfo,
        });
    }
}