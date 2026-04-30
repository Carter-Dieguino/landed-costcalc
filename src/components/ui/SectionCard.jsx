export default function SectionCard({ children, style = {} }) {
  return (
    <section
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "var(--shadow-soft)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
