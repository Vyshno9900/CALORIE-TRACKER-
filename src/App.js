import React, { useState } from "react";
import "./styles.css";

export default function VyshnoApp() {
  const [form, setForm] = useState({
    age: 25,
    sex: "male",
    weight: 70,
    height: 175,
    goal: "maintain"
  });
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleCalculate(e) {
    e.preventDefault();
    setLoading(true);
    setResult([]);

    try {
      const res = await fetch("/api/gemini-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: form.age,
          sex: form.sex,
          weight: form.weight,
          height: form.height,
          goal: form.goal,
          calories: 2200
        })
      });
      const data = await res.json();
      setResult(data.foodPlan || []);
    } catch (err) {
      alert("Error fetching plan");
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="app">
      <h1>Vyshno AI Food Tracker</h1>
      <form onSubmit={handleCalculate}>
        <input name="age" value={form.age} onChange={onChange} placeholder="Age" />
        <input name="weight" value={form.weight} onChange={onChange} placeholder="Weight (kg)" />
        <input name="height" value={form.height} onChange={onChange} placeholder="Height (cm)" />
        <select name="sex" value={form.sex} onChange={onChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="goal" value={form.goal} onChange={onChange}>
          <option value="maintain">Maintain</option>
          <option value="bulk">Bulk</option>
          <option value="cut">Cut</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Plan"}
        </button>
      </form>

      {result.length > 0 && (
        <ul>
          {result.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
