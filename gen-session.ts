import { Md5 } from "https://deno.land/std@0.119.0/hash/md5.ts";

function generateSessionChars() {
    const characters = [];
    for (let num = 48; num <= 57; num++) characters.push(num);
    for (let upp = 65; upp <= 90; upp++) characters.push(upp);
    for (let low = 97; low <= 122; low++) characters.push(low);
    return String.fromCharCode(...characters);
}

const chars = generateSessionChars();

export function generateSessionToken(length = 26) {
    const token = [];
    for (let i = 0; i < length; i++) {
        token.push(chars.at(Math.round(Math.random() * chars.length)));
    }
    return token.join("");
}

/**
 * make password hash
 * @param  {...string} input
 * @returns {string} an md5-uppercase of input elements concatenated with a ":"
 */
export function makePWHash(...input: string[]): string {
    const md5 = new Md5();
    const hex_md5 = (str: string) =>
        md5.update(str).toString("hex").toUpperCase();
    return hex_md5(input.join(":"));
}

if (import.meta.main) console.log(makePWHash("salada", "balada"));
