/**
 * Reads an official biography file (src/data/bios/*.txt):
 *   line 1  stage name
 *   line 2  legal name
 *   (blank line)
 *   paragraphs, separated by blank lines
 * The text is used exactly as written; only line endings are normalised.
 */
export function parseBio(raw: string) {
  const [header = "", ...paragraphs] = raw.replace(/\r\n?/g, "\n").trim().split(/\n[ \t]*\n/);
  const [name = "", realName = ""] = header.split("\n");
  return { name, realName, bio: paragraphs };
}
