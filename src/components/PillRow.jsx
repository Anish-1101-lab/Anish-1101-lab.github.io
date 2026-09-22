function PillRow({ links, className = "" }) {
  if (!links || links.length === 0) return null;
  const isInternal = (href) => href.startsWith("#/");
  return (
    <p className={`mt-2.5 flex flex-wrap gap-1.5 ${className}`}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={isInternal(link.href) ? undefined : "_blank"}
          rel={isInternal(link.href) ? undefined : "noreferrer"}
          className="rounded-full border border-blue-700/40 px-3 py-0.5 text-xs font-medium text-blue-700 no-underline transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent dark:border-blue-400/40 dark:text-blue-400 dark:hover:border-accent dark:hover:bg-accent/10 dark:hover:text-accent"
        >
          {link.label}
        </a>
      ))}
    </p>
  );
}

export default PillRow;
