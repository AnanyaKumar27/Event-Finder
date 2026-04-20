export default function Controls({
  searchText,
  setSearchText,
  filter,
  setFilter
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div>
        {["All", "Upcoming", "Past", "Registered"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}