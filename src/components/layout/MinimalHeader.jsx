import { Link } from "react-router-dom";


export default function MinimalHeader() {
  return (
    <header className="kd-header minimal">
      <Link to="/" className="kd-brand">
        <img src="/images/cow-icon.png" alt="logo" />
        <span>Kamdhenu Dairy</span>
      </Link>
    </header>
  );
}
