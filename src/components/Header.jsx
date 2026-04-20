export default function Header({ totalRegistered }) {
  return (
    <header className="header">
      <div className="header-inner">
        <h2>🤝 ImpactHub</h2>
        <div>
          Registered: {totalRegistered}
        </div>
      </div>
    </header>
  );
}