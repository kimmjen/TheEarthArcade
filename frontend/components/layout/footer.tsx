export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-12">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-4 text-xs text-muted-foreground">
                    OFFICIAL FAN SITE PROJECT
                </p>
                <h2 className="mb-8 text-2xl font-bold tracking-widest text-white/20">
                    EARTH ARCADE
                </h2>
                <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-primary">TvN</a>
                    <a href="#" className="hover:text-primary">TVING</a>
                    <a href="#" className="hover:text-primary">YouTube</a>
                    <a href="#" className="hover:text-primary">Instagram</a>
                </div>
                <div className="mt-12 text-xs text-white/10">
                    &copy; {new Date().getFullYear()} EARTH ARCADE FAN ARCHIVE. ALL RIGHTS RESERVED.
                </div>
            </div>
        </footer>
    )
}
