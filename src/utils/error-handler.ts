// PURPOSE: Every error in the extension is classified,
// structured, and handled through here.

import { createLogger } from './logger'

export const enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    FATAL = 'fatal',
}



export class AppError  extends Error{
    public readonly severity : ErrorSeverity ;
    public readonly context : Record<string, unknown>;
    public readonly timestamp: string


    //constructor
    constructor(message : string, severity : ErrorSeverity ,context : Record<string, unknown>){
        super(message)

        this.name  = 'AppError'
        this.severity  = severity
        this.context   = context
        this.timestamp = new Date().toISOString()

        Object.setPrototypeOf(this, AppError.prototype)

    }
}


const logger = createLogger('error-handler')

export function handleError(error : unknown, context : Record<string, unknown> = {} ) : AppError {

    //handles app error
    if(error instanceof AppError) {
        logger.error(error.message, {
            severity : error.severity,
            context  : { ...error.context, ...context },
            timestamp: error.timestamp,
        })

        return error;
    }

    // the error may be anything apart from the apperror  it handles 
    if(error instanceof Error)
    {
        const appError = new AppError(
            error.message,
            ErrorSeverity.MEDIUM,
            { ...context, stack: error.stack }
        )

        logger.error(appError.message,{ severity: appError.severity, context : appError.context})
        return appError;

    }

    const appError = new AppError(
        String(error),
        ErrorSeverity.LOW,
        context
    )
    logger.error(appError.message, { severity: appError.severity, context : appError.context})

    return appError;
}
