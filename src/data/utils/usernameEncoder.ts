// @ts-ignore
import MD5 from "md5.js";

/**
 * Encoding utilities for usernames to work with DHIS2 SQL view variables.
 * DHIS2 only allows characters matching: ^[\\p{L}\\w\\s\\-]$
 *
 * Uses MD5 hash for generic encoding of any string, including special characters.
 * The SQL view will compare MD5 hashes instead of direct string comparison.
 *
 * Example: adrian@eyeseetea.com → 5d41402abc4b2a76b9719d911017c592 (MD5 hash)
 */
export function encodeUsername(username: string): string {
    return new MD5().update(username).digest("hex");
}
