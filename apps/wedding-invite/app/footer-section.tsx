const footerAuthor = "Jeynes"

export function FooterSection() {
  return (
    <section id="footer" className="border-t border-stone-200 bg-white px-6 py-10 text-center">
      <p className="text-xs text-stone-400">With love, 철수 💍 영희</p>
      <p className="mt-4 text-[10px] text-stone-400">
        © {new Date().getFullYear()} {footerAuthor}. All rights reserved.
      </p>
    </section>
  )
}
