// PURPOSE: Every piece of data coming FROM outside the extension — DOM content, user input, storage reads —
// must pass through here before being used or stored. CLAUDE.md rule: "All data from external sources must
//pass through sanitizer before use or storage", "Never use innerHTML with external data"
import { createLogger } from "./logger";

const logger = createLogger('sanitizer');


//string sanitizer 
export const sanitizeString = (
    input : unknown,
    maxLength : number = 500
) => {
    // WHY: Input comes from the DOM or user.

    // We never trust its type. Check first.
    if(typeof input  != 'string' ){
        logger.warn("sanitizeString received non-string input", {type : typeof input, value : String(input).substring(0,50)})
        return ''
    }

    return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength)
}


//url sanittizer
export const sanitizeUrl = (
    input : unknown,
) => {

    //check wheather input is string or not 
    if (typeof input !== 'string') {
        logger.warn('sanitizeUrl received non-string input', {
          type: typeof input
        })
        return ''
    }

    try{
        const parsed = new URL(input)
        if (parsed.protocol !== 'https:') {
            logger.warn('sanitizeUrl rejected non-https URL', {
              protocol: parsed.protocol
            })
            return ''
        }
      
        return parsed.toString()
    }catch{
        logger.warn('sanitizeUrl received invalid URL', {
            input: input.substring(0, 100)
        })
          return ''
    }
}






