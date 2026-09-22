import { renderAuthors, renderInline } from "./inline";
import PillRow from "./PillRow";
import ThumbTile from "./ThumbTile";
import Venue from "./Venue";

function PublicationRow({ paper }) {
  const thumbHref = paper.slug ? `#/project/${paper.slug}` : paper.links?.[0]?.href;
  const titleHref = paper.slug ? `#/project/${paper.slug}` : paper.links?.[0]?.href;

  return (
    <article className="row-fade-in flex gap-4 border-b border-zinc-200 pb-7 last:border-b-0 last:pb-0 dark:border-zinc-800 sm:gap-6">
      <ThumbTile
        title={paper.title}
        tag={paper.tag}
        href={thumbHref}
        reveal={paper.reveal}
        flow={paper.flow}
        stages={paper.stages}
        image={paper.image}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
          {titleHref ? (
            <a href={titleHref} className="hover:text-blue-700 dark:hover:text-blue-400">
              {paper.title}
            </a>
          ) : (
            paper.title
          )}
        </h3>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          {renderAuthors(paper.authors, paper.title)}
        </p>
        {paper.affiliations && (
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
            {renderInline(paper.affiliations, `${paper.title}-aff`)}
          </p>
        )}
        <Venue
          venue={paper.venue}
          accepted={paper.accepted}
          award={paper.award}
          keyPrefix={`${paper.title}-venue`}
        />
        <PillRow links={paper.links} />
        {paper.summary && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {paper.summary}
          </p>
        )}
      </div>
    </article>
  );
}

export default PublicationRow;
