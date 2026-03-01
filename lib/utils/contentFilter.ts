/**
 * Utility for filtering restricted content such as emails, phone numbers, and inappropriate words.
 */

// Regex for common email patterns
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;

/**
 * Regex for phone numbers:
 * 1. Nigerian formats (091..., 91..., +234...)
 * 2. General 10-15 digit sequences often used for phone numbers
 */
const PHONE_REGEX =
  /(\+?234|0)?([789][01]\d{8})\b|\b0\d{10}\b|\b\d{10,13}\b|(\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g;

// List of common inappropriate words (expand as needed)
const INAPPROPRIATE_WORDS = [
  "fuck",
  "bitch",
  "shit",
  "asshole",
  "scam",
  "fraud",
  "scammer",
  "bastard",
  "dick",
  "pussy",
  "nude",
  "sex",
  "porn",
  "idiot",
  "stupid",
  "vagina",
  "penis",
  "cum",
  "slut",
  "whore",
  "cunt",
  "motherfucker",
];

const PROFANITY_REGEX = new RegExp(
  `\\b(${INAPPROPRIATE_WORDS.join("|")})\\b`,
  "gi",
);

export interface FilterResult {
  restricted: boolean;
  reason?: string;
}

export function containsRestrictedContent(text: string): FilterResult {
  // Check for emails
  const emailObfuscation = [
    /\b[A-Za-z0-9._%+-]+\s*\[at\]\s*[A-Za-z0-9.-]+\s*\[dot\]\s*[A-Z|a-z]{2,}\b/gi,
    /\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/gi,
    /\b[A-Za-z0-9._%+-]+\s*\(at\)\s*[A-Za-z0-9.-]+\s*\(dot\)\s*[A-Z|a-z]{2,}\b/gi,
  ];

  const hasEmail =
    text.match(EMAIL_REGEX) || emailObfuscation.some((re) => text.match(re));

  if (hasEmail) {
    return {
      restricted: true,
      reason: "Sharing email addresses is not allowed for security reasons.",
    };
  }

  // Check for phone numbers
  const phoneMatch = text.match(PHONE_REGEX);
  if (phoneMatch) {
    return {
      restricted: true,
      reason: "Sharing phone numbers is not allowed for security reasons.",
    };
  }

  // Check for inappropriate words
  const profanityMatch = text.match(PROFANITY_REGEX);
  if (profanityMatch) {
    return {
      restricted: true,
      reason: "Inappropriate language or suspicious terms detected.",
    };
  }

  return { restricted: false };
}
