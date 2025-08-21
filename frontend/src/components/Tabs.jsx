export default function Tabs({ active, onChange }) {
  const tabs = ["Analyze", "History"];
  return (
    <div className="inline-flex rounded-xl border bg-white overflow-hidden">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-5 py-2 text-sm font-semibold ${
            active === t
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
