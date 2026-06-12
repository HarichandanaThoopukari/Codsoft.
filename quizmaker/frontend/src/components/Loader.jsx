const Loader = ({ message = 'Loading...' }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="text-center">
      <div className="relative mx-auto mb-4 h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-500" />
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  </div>
);

export default Loader;
