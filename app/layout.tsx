import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider, useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Epistelle",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  
  const redirectTo = user ? "/public-blogs" : "/";

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                    <Link
                      href={redirectTo}
                      className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
                    >
                      Epistelle
                    </Link>
                    <div>
                      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    </div>
                  </div>
                </header>
              </nav>
              <div className="flex flex-col max-w-5xl p-5">{children}</div>
              <footer className="w-full border-t bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-100">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">About</h3>
                    <p className="text-sm">
                      This is a starter kit for building apps with Next.js and
                      Supabase.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/about-us" className="hover:underline">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/public-blogs" className="hover:underline">
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact-us" className="hover:underline">
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="text-sm">
                      Email:{" "}
                      <a
                        href="mailto:contact@example.com"
                        className="hover:underline"
                      >
                        contact@example.com
                      </a>
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-gray-400 transition"
                        aria-label="Twitter"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.2 4.2 0 0 0 1.85-2.31 8.27 8.27 0 0 1-2.64 1.01 4.14 4.14 0 0 0-7.05 3.78A11.73 11.73 0 0 1 3.15 4.5a4.13 4.13 0 0 0 1.28 5.52 4.09 4.09 0 0 1-1.88-.52v.05a4.14 4.14 0 0 0 3.32 4.05 4.17 4.17 0 0 1-1.87.07 4.14 4.14 0 0 0 3.86 2.87A8.31 8.31 0 0 1 2 19.54a11.69 11.69 0 0 0 6.29 1.84c7.55 0 11.68-6.25 11.68-11.68 0-.18 0-.35-.01-.53A8.34 8.34 0 0 0 24 5.54a8.4 8.4 0 0 1-2.42.66 4.2 4.2 0 0 0 1.84-2.31z" />
                        </svg>
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-gray-400 transition"
                        aria-label="Facebook"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-7H7.89v-2.88h2.55v-2.2c0-2.52 1.5-3.89 3.79-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.55v1.87h2.77l-.44 2.88h-2.33v7A10.02 10.02 0 0 0 22 12z" />
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-gray-400 transition"
                        aria-label="Instagram"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm8.5 2c2.14 0 3.75 1.61 3.75 3.75v8.5c0 2.14-1.61 3.75-3.75 3.75h-8.5C5.61 20 4 18.39 4 16.25v-8.5C4 5.61 5.61 4 7.75 4h8.5zm-4.25 3.25A4.25 4.25 0 1 0 16.25 12 4.25 4.25 0 0 0 12 7.25zm0 2A2.25 2.25 0 1 1 9.75 12 2.25 2.25 0 0 1 12 9.25zm5.16-3.66a.91.91 0 1 0 .91.91.91.91 0 0 0-.91-.91z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t dark:border-gray-700 py-4 text-center text-sm">
                  &copy; {new Date().getFullYear()} Next.js Starter. All rights
                  reserved.
                </div>
                <div className="flex items-center w-full justify-center bg-transparent">
                  <ThemeSwitcher />
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
