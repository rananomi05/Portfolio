export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-xs text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Noman Rajpoot. Built with Next.js.</p>
        <div className="flex gap-6">
          <a href="https://github.com/rananomi05" className="hover:text-signal transition-colors">
            GitHub
          </a>
          <a href="mailto:noman987rajpoot@gmail.com" className="hover:text-signal transition-colors">
            Email
          </a>
          <a href="/login" className="hover:text-signal transition-colors">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
