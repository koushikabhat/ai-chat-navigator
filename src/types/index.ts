// PURPOSE:
// This file defines all shared contracts across the extension.
// WHY: Prevents inconsistent data, runtime bugs, and unsafe messaging.

export const enum MessageType  {
  GET_CHAT_STRUCTURE = 'GET_CHAT_STRUCTURE',
  CHAT_STRUCTURE_RESPONSE = 'CHAT_STRUCTURE_RESPONSE',
  SCROLL_TO_SECTION = 'SCROLL_TO_SECTION',
  ERROR = 'ERROR',
} 

export interface ExtensionMessage<T  = unknown>{
    type : MessageType;
    payload : T;
    requestId: string;   // Used to match request-response
    timestamp: number;   
}

export interface MessageResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    requestId: string;
}

export interface ChatSection {
    id: string;         // Unique identifier
    title: string;      // Display text
    position: number;   // Scroll position (Y offset)
}
  
  /**
   * Entire chat structure
   */
export interface ChatStructure {
    sections: ChatSection[];
}