// PURPOSE:
// Centralized messaging layer for the entire extension.
// WHY: Enforces type safety, error handling, timeout handling,
// and structured communication between extension layers.

import { createLogger } from '../utils/logger';
import { handleError } from '../utils/error-handler';
import type {
  ExtensionMessage,
  MessageResponse,
} from '../types';

// Initialize logger
const logger = createLogger('messaging-service');

// Timeout for message response (in ms)
const MESSAGE_TIMEOUT = 5000;

/**
 * MessagingService
 *
 * WHY:
 * Abstracts chrome.runtime messaging into a safe, predictable,
 * promise-based system with timeout + error handling.
 */
class MessagingService {

  //Generate unique request ID
  
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }


  public async sendMessage<T, R>(
    type: ExtensionMessage<T>['type'],
    payload: T
  ): Promise<MessageResponse<R>> {

    const requestId = this.generateRequestId();

    // Build normalized message
    const message: ExtensionMessage<T> = {
      type,
      payload,
      requestId,
      timestamp: Date.now(),
    };

    try 
    {
      return await this.sendWithTimeout<R>(message, requestId);
    } 
    catch (error) 
    {
      const appError = handleError(error, {
        location: 'MessagingService.sendMessage',
        requestId,
      });

      logger.error('sendMessage failed', {
        error: appError,
        requestId,
      });

      return {
        success: false,
        error: appError.message,
        requestId,
      };
    }
  }



  // Core messaging logic with timeout
  private async sendWithTimeout<R>(
    message: ExtensionMessage<unknown>,
    requestId: string
  ): Promise<MessageResponse<R>> {

    //this it returns a promise because the sendMessage cherome uses callback so we dont know when the data is served so we use 
    //promise so it can be resolve 

    return new Promise<MessageResponse<R>>((resolve) => {

      let isResolved = false;

      // Timeout handler
      const timeoutId = setTimeout(() => {
        if (isResolved) return;

        isResolved = true;

        logger.error('Message timeout', { requestId });

        resolve({
          success: false,
          error: 'Message timeout',
          requestId,
        });
      }, MESSAGE_TIMEOUT);

      try {
        chrome.runtime.sendMessage(message, (response: MessageResponse<R>) => {

          if (isResolved) return;

          isResolved = true;

          //clear  timeout
          clearTimeout(timeoutId);

          // Chrome runtime error
          if (chrome.runtime.lastError) {
            logger.error('Chrome runtime error during sendMessage', {
              error: chrome.runtime.lastError.message,
              requestId,
            });

            resolve({
              success: false,
              error: chrome.runtime.lastError.message,
              requestId,
            });
            return;
          }

          // No response
          if (!response) 
          {
            logger.warn('No response received from message', {
              requestId,
            });

            resolve({
              success: false,
              error: 'No response received',
              requestId,
            });
            
            return;
          }

          // Success
          resolve(response);
        });

      } catch (error) {
        if (isResolved) return;

        isResolved = true;
        clearTimeout(timeoutId);

        const appError = handleError(error, {
          location: 'MessagingService.sendWithTimeout',
          requestId,
        });

        logger.error('sendWithTimeout failure', {
          error: appError,
          requestId,
        });

        resolve({
          success: false,
          error: appError.message,
          requestId,
        });
      }
    });
  }
}


export const messagingService = new MessagingService();