export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The [locale] layout owns <html> and <body>.
  // This root layout must exist for Next.js App Router but must NOT
  // wrap children in any additional element — doing so creates a
  // double-html nesting that causes a hydration mismatch.
  return children as React.ReactElement;
}
