import LayerPlayground from "./LayerPlayground";
import Math from "./Math";
import PatchingAudit from "./PatchingAudit";
import PillRow from "./PillRow";
import Venue from "./Venue";
import { renderAuthors, renderInline } from "./inline";

function Figure({ src, alt }) {
  return (
    <div className="thumb-tile overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800">
      <img src={src} alt={alt} className="w-full" loading="lazy" />
    </div>
  );
}

function Block({ block, index }) {
  switch (block.type) {
    case "figure":
      return (
        <figure key={index} className="mt-4">
          <Figure src={block.src} alt={block.alt} />
          {block.caption && (
            <figcaption className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              {renderInline(block.caption, `fig-${index}`)}
            </figcaption>
          )}
        </figure>
      );
    case "figrow": {
      const gridCols =
        block.images.length >= 3 ? "sm:grid-cols-3" : block.images.length === 2 ? "sm:grid-cols-2" : "";
      return (
        <figure key={index} className="mt-4">
          <div className={`grid gap-3 ${gridCols}`}>
            {block.images.map((img, i) => (
              <Figure key={i} src={img.src} alt={img.alt} />
            ))}
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              {renderInline(block.caption, `figrow-${index}`)}
            </figcaption>
          )}
        </figure>
      );
    }
    case "h2":
      return (
        <h2
          key={index}
          className="mt-9 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={index}
          className="mt-8 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={index} className="mt-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {renderInline(block.text, `p-${index}`)}
        </p>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="mt-4 border-l-2 border-blue-700/50 pl-4 text-[15px] italic leading-relaxed text-zinc-600 dark:border-blue-400/50 dark:text-zinc-400"
        >
          {renderInline(block.text, `q-${index}`)}
        </blockquote>
      );
    case "eq":
      return (
        <div key={index} className="mt-4 text-[15px]">
          <Math tex={block.tex} display />
        </div>
      );
    case "list":
      return (
        <ul key={index} className="mt-3 space-y-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
              <span>{renderInline(item, `l-${index}-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={index} className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-2 py-1.5 text-left font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-zinc-200 dark:border-zinc-800">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-2 py-1.5 text-zinc-700 dark:text-zinc-300">
                      {renderInline(cell, `t-${index}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "code":
      return (
        <pre
          key={index}
          className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-[13px] leading-relaxed text-zinc-100 dark:bg-black"
        >
          <code>{block.text}</code>
        </pre>
      );
    case "callout":
      return (
        <div
          key={index}
          className="mt-4 rounded-lg border border-zinc-200 bg-zinc-100/70 px-4 py-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400"
        >
          {block.title && (
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-500">
              {block.title}
            </p>
          )}
          {renderInline(block.text, `c-${index}`)}
        </div>
      );
    case "algo":
      return (
        <div
          key={index}
          className="mt-4 rounded-lg border border-blue-700/30 bg-blue-50/50 p-4 text-sm leading-relaxed dark:border-blue-400/30 dark:bg-blue-950/20"
        >
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-blue-800 dark:text-blue-300">
            {block.title}
          </p>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            <strong>Input: </strong>
            {renderInline(block.input, `a-in-${index}`)}
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
            {block.steps.map((step, i) => (
              <li key={i}>{renderInline(step, `a-${index}-${i}`)}</li>
            ))}
          </ol>
        </div>
      );
    case "layers":
      return <LayerPlayground key={index} />;
    case "patching":
      return <PatchingAudit key={index} />;
    default:
      return null;
  }
}

function ProjectPage({ project, onBack }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 md:px-0">
      <a
        href="#/"
        onClick={onBack}
        className="text-sm text-blue-700 hover:underline dark:text-blue-400"
      >
        ← All research
      </a>

      <h1 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100">
        {project.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {renderAuthors(project.authors, "hdr")}
      </p>
      {project.affiliations && (
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
          {renderInline(project.affiliations, "hdr-aff")}
        </p>
      )}
      <Venue
        venue={project.venue}
        accepted={project.accepted}
        award={project.award}
        keyPrefix="hdr-venue"
      />
      <PillRow links={project.links} />
      {project.summary && (
        <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          {project.summary}
        </p>
      )}

      {project.teaser && (
        <div className="mt-5">
          <Figure src={project.teaser.src} alt={project.teaser.alt} />
        </div>
      )}

      <div className="mt-8 border-t border-zinc-200 pt-2 dark:border-zinc-800">
        {project.body.map((block, i) => (
          <Block key={i} block={block} index={i} />
        ))}
      </div>

      <h3
        id="publication"
        className="mt-10 border-t border-zinc-200 pt-8 text-base font-bold tracking-tight text-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
      >
        Publication
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {renderInline(project.publication, "pub")}
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-[13px] leading-relaxed text-zinc-100 dark:bg-black">
        <code>{project.bibtex}</code>
      </pre>

      {project.code && (
        <>
          <h3 className="mt-8 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Code
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {renderInline(project.code, "code")}
          </p>
        </>
      )}

      <h3 className="mt-8 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Contributors
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {typeof project.contributors === "string"
          ? renderInline(project.contributors, "contrib")
          : renderAuthors(project.contributors, "contrib")}
        {project.contributorsNote && <> {renderInline(project.contributorsNote, "contrib-note")}</>}
      </p>

      <p className="mt-10 border-t border-zinc-200 pt-6 text-sm dark:border-zinc-800">
        <a href="#/" onClick={onBack} className="text-blue-700 hover:underline dark:text-blue-400">
          ← Back to all research
        </a>
      </p>
    </div>
  );
}

export default ProjectPage;
