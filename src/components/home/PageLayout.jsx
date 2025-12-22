export default function PageLayout({ children }) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 16px',
      }}
    >
      {children}
    </div>
  );
}
