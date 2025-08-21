import { useEffect, useState, useMemo } from "react";
import { API_BASE } from "../config";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HistoryView() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setBusy(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/api/history/`);
        const data = await res.json();
        setRows(data || []);
      } catch (e) {
        setErr("Failed to load history");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  // Distribution of categories
  const dist = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => m.set(r.category, (m.get(r.category) || 0) + 1));
    return Array.from(m, ([name, value]) => ({ name, value }));
  }, [rows]);

  return (
    <div className="grid gap-6">
      <motion.div
        className="bg-white rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-bold mb-4">History</h2>
        {busy && <p>Loading…</p>}
        {err && <p className="text-red-600">{err}</p>}
        {!busy && !err && (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2">Excerpt</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2 pr-4">{i + 1}</td>
                    <td className="py-2 pr-4 font-semibold">{r.category}</td>
                    <td className="py-2 pr-4">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="py-2">{r.input_text.slice(0, 50)}...</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-gray-500">
                      No records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl shadow p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-bold mb-4">Category Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dist}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
