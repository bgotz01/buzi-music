import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/music', label: 'Music' },
    { href: '/admin', label: 'Admin' },
    { href: '/about', label: 'About' },
]

export default function Navbar() {
    return (
        <header
            className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)]"
            style={{ backgroundColor: 'var(--color-nav-bg)', backdropFilter: 'blur(12px)' }}
        >
            <nav
                className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
                aria-label="Main navigation"
            >
                {/* Logo / brand */}
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                >
                    buzi<span className="text-[var(--color-accent)]">.</span>
                </Link>

                {/* Nav links */}
                <ul className="hidden items-center gap-6 sm:flex" role="list">
                    {navLinks.map(({ href, label }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className="text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}
