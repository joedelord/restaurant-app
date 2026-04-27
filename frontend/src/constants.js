/**
 * constants.js (auth tokens)
 *
 * Constants for authentication token storage keys.
 *
 * Responsibilities:
 * - Defines localStorage keys for JWT tokens
 * - Prevents hardcoded string usage across the application
 *
 * Notes:
 * - Used by auth services and API client
 * - Changing these values will affect token persistence
 */

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";
