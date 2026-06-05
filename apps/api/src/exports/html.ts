/**
 * Minimalistický prevod nášho Markdownu (z renderSummaryMarkdown) na HTML.
 * Podporuje nadpisy (##, ###), odrážky (-), tučné (**...**) a odstavce.
 */
export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  const inline = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("### ")) {
      closeList();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  return out.join("\n");
}

export function wrapHtmlDocument(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1e293b; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
  h1 { color: #155e75; }
  h2 { color: #0e7490; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 28px; }
  h3 { color: #334155; margin-top: 18px; }
  ul { padding-left: 20px; }
  .meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }
  .footer { margin-top: 40px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
</style>
</head>
<body>
${bodyHtml}
<div class="footer">Vygenerované systémom DAKA Hlas</div>
</body>
</html>`;
}
