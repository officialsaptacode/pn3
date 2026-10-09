export function sanitize(html: string): string {
  if (!html) return "";

  // First pass: remove HTML tags using regex
  let text = html.replace(/<[^>]*>/g, "");

  // Second pass: decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&[#a-z0-9]+;/gi, " "); // Remove any remaining entities

  // Normalize whitespace
  return text
    .replace(/\r\n|\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSafeExcerpt(html: string, limit = 150): string {
  if (!html) return "";

  const cleanText = sanitize(html);

  if (cleanText.length <= limit) return cleanText;

  const sliced = cleanText.substring(0, limit);

  // Avoid cutting words halfway
  const lastSpace = sliced.lastIndexOf(" ");
  return lastSpace > 0 ? `${sliced.substring(0, lastSpace)}...` : `${sliced}...`;
}
