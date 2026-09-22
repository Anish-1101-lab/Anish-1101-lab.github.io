// A two-column section shell: a small icon+label column on the left, content
// on the right — mirrors the label/content rows used for News, Awards, and
// Service on the reference site, instead of one long stacked list.
function ColumnSection({ icon: Icon, label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:gap-6 ${className}`}>
      <div className="flex shrink-0 flex-row items-center gap-2 text-zinc-500 dark:text-zinc-400 sm:w-28 sm:flex-col sm:items-center sm:pt-1">
        {Icon && <Icon className="h-6 w-6 text-blue-700 dark:text-blue-400" />}
        <span className="text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default ColumnSection;
