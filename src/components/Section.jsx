function Section({ title, subtitle, children, className = "" }) {
  return (
    <section className={`mx-auto w-full max-w-3xl px-6 py-10 md:px-0 ${className}`}>
      <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
      <div className="mt-5 space-y-7">{children}</div>
    </section>
  );
}

export default Section;
