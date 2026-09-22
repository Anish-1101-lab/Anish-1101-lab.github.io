import { renderInline } from "./inline";

function Venue({ venue, accepted, award, keyPrefix = "venue" }) {
  return (
    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 [&_a]:underline [&_a]:decoration-blue-700/40 [&_a]:underline-offset-2 dark:[&_a]:decoration-blue-400/40">
      {accepted && (
        <span className="mr-2 inline-block rounded-full bg-emerald-100 px-2 py-px align-[1px] text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          Accepted
        </span>
      )}
      {award && (
        <span className="mr-2 inline-block rounded-full bg-amber-100 px-2 py-px align-[1px] text-xs font-semibold text-amber-800 ring-1 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-700/60">
          {award}
        </span>
      )}
      <span className={accepted ? "" : "italic"}>{renderInline(venue, keyPrefix)}</span>
    </p>
  );
}

export default Venue;
