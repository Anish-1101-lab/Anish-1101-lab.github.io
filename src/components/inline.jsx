import Math from "./Math";

const NAME_RE = /Anish Sathyanarayanan\*?/g;
const INLINE_RE = /(\$[^$\n]+\$)|(\*\*[^*]+\*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/g;

// Wraps every occurrence of the site owner's name in a highlighted <strong>,
// used across author lists and prose on both the home page and project pages.
export function highlightName(text, keyPrefix = "n") {
  if (!text) return text;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  const re = new RegExp(NAME_RE);
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <strong key={`${keyPrefix}-${key++}`} className={HIGHLIGHT_CLASS}>
        {match[0]}
      </strong>
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

const HIGHLIGHT_CLASS =
  "font-bold text-zinc-900 underline decoration-accent/70 decoration-2 underline-offset-2 dark:text-zinc-50";

// Renders an author byline. Accepts either a plain string (existing
// behavior: just highlight the site owner's name) or an array of
// { name, href, sup, star } so every co-author can link to their own page,
// with an optional affiliation-index superscript instead of repeating full
// names again in a separate affiliations sentence.
export function renderAuthors(authors, keyPrefix = "au") {
  if (typeof authors === "string") return renderInline(authors, keyPrefix);

  const nodes = [];
  authors.forEach((author, i) => {
    if (i > 0) nodes.push(", ");
    const isOwner = author.name.startsWith("Anish Sathyanarayanan");
    const nameNode = author.href ? (
      <a
        key={`${keyPrefix}-a-${i}`}
        href={author.href}
        target="_blank"
        rel="noreferrer"
        className="text-blue-700 hover:underline dark:text-blue-400"
      >
        {author.name}
      </a>
    ) : (
      author.name
    );
    const withSup = author.sup ? (
      <>
        {nameNode}
        <sup className="ml-px">
          {author.sup}
          {author.star ? "*" : ""}
        </sup>
      </>
    ) : (
      nameNode
    );
    nodes.push(
      isOwner ? (
        <strong key={`${keyPrefix}-s-${i}`} className={HIGHLIGHT_CLASS}>
          {withSup}
        </strong>
      ) : (
        <span key={`${keyPrefix}-n-${i}`}>{withSup}</span>
      )
    );
  });
  return nodes;
}

// Minimal inline-markdown renderer for project-page prose: $math$, **bold**,
// `code`, and [text](url) links, with the owner's name highlighted throughout.
export function renderInline(text, keyPrefix = "i") {
  if (!text) return null;
  const nodes = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  const re = new RegExp(INLINE_RE);
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...highlightName(text.slice(lastIndex, match.index), `${keyPrefix}-${key++}`));
    }
    const token = match[0];
    if (token[0] === "$") {
      nodes.push(<Math key={`${keyPrefix}-${key++}`} tex={token.slice(1, -1)} />);
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-${key++}`}>
          {renderInline(token.slice(2, -2), `${keyPrefix}-${key}`)}
        </strong>
      );
    } else if (token[0] === "`") {
      nodes.push(
        <code
          key={`${keyPrefix}-${key++}`}
          className="rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token[0] === "[") {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      nodes.push(
        <a
          key={`${keyPrefix}-${key++}`}
          href={m[2]}
          target={m[2].startsWith("#") ? undefined : "_blank"}
          rel={m[2].startsWith("#") ? undefined : "noreferrer"}
          className="text-blue-700 hover:underline dark:text-blue-400"
        >
          {m[1]}
        </a>
      );
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(...highlightName(text.slice(lastIndex), `${keyPrefix}-${key++}`));
  }
  return nodes;
}
