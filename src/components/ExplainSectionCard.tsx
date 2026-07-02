import type { ReactNode } from 'react'

export function ExplainSectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="explain-section-card">
      <h3>{title}</h3>
      {children}
    </section>
  )
}
