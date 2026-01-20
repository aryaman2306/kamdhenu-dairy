export default function AdminAnalyticsPage() {
  return (
    <div style={page}>
      <h2>Analytics</h2>
      <p style={text}>
        Sales analytics dashboard will appear here.
      </p>
      <p style={muted}>
        (Daily / monthly revenue, order trends, top products)
      </p>
    </div>
  );
}

const page = {
  padding: 32,
  minHeight: "100vh",
  background: "#f9fafb",
};

const text = {
  marginTop: 16,
  fontSize: 15,
};

const muted = {
  marginTop: 8,
  fontSize: 13,
  color: "#6b7280",
};
