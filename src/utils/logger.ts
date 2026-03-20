export const enum LogLevel {
    DEBUG  = 'debug',
    INFO = 'info',
    WARN  = 'warn',
    ERROR = 'error',
}

interface LogEntry {
    level : LogLevel;
    message : string;
    context? : Record<string, unknown>;
    timestamp : string;
    source: string;
}



class Logger {
    private readonly source : string
    private readonly isDevelopment : boolean

    constructor(source : string){
        this.source = source;
        this.isDevelopment = process.env.NODE_ENV !== 'production'
    }

    private format(entry: LogEntry): string {
        return `[${entry.timestamp}] [${entry.source}] [${entry.level.toUpperCase()}] ${entry.message}`
    }
    
    private log( level : LogLevel, message : string, context?: Record<string, unknown>) : void {

        //logentry
        const entry : LogEntry  = {
            level,
            message, 
            context,
            timestamp: new Date().toISOString(),
            source : this.source
        }

        //if it is in prod than dont use debug and info
        if( (level == LogLevel.DEBUG || level == LogLevel.INFO ) && !this.isDevelopment ){
           return
        }

        const formatted = this.format(entry)

        switch (level) {
            case LogLevel.DEBUG : console.debug(formatted, context ?? ''); break
            case LogLevel.INFO : console.info(formatted,  context ?? ''); break
            case LogLevel.WARN : console.warn(formatted,  context ?? ''); break
            case LogLevel.ERROR: console.error(formatted, context ?? ''); break
        }

    }


    //debug
    public debug(message : string, context?: Record<string, unknown>) : void {
        this.log(LogLevel.DEBUG, message, context)
    }

    //info
    public info(message : string, context? : Record<string, unknown>) : void {
        this.log(LogLevel.INFO, message, context)
    }

    //warn
    public warn(message : string, context? : Record<string, unknown>) : void {
        this.log(LogLevel.WARN, message, context)
    }

    //Error
    public error(message : string, context? : Record<string, unknown>) : void {
        this.log(LogLevel.ERROR, message, context)
    }


}


export function createLogger(source : string) : Logger {
    return new Logger(source)
}