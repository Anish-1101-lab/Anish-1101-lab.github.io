import AvatarTile from "./AvatarTile";
import { renderInline } from "./inline";
import PillRow from "./PillRow";

function ExperienceRow({ item }) {
  return (
    <article className="row-fade-in flex gap-4 border-b border-zinc-200 pb-7 last:border-b-0 last:pb-0 dark:border-zinc-800 sm:gap-6">
      <AvatarTile org={item.org} href={item.orgHref} logo={item.logo} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {item.role},{" "}
            {item.orgHref ? (
              <a
                href={item.orgHref}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline dark:text-blue-400"
              >
                {item.org}
              </a>
            ) : (
              item.org
            )}
          </h3>
          <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
            {item.duration}
          </p>
        </div>
        {item.note && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {item.noteHref ? (
              <a
                href={item.noteHref}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline dark:text-blue-400"
              >
                {item.note}
              </a>
            ) : (
              renderInline(item.note, `${item.org}-note`)
            )}
          </p>
        )}
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <PillRow links={item.links} />
      </div>
    </article>
  );
}

export default ExperienceRow;
