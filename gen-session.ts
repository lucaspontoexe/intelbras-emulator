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
    return token.join('');
}

if (import.meta.main) console.log(generateSessionToken());
