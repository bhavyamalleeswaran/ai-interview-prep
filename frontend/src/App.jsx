import { useState } from "react"

const API = "http://localhost:8000"

export default function App() {
  const [role, setRole] = useState("Software Engineer")
  const [level, setLevel] = useState("Mid-level")
  const [qType, setQType] = useState("behavioral")
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  async function getQuestion() {
    setLoading(true)
    setFeedback(null)
    setAnswer("")
    const res = await fetch(`${API}/api/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, level, q_type: qType, count: 1 })
    })
    const data = await res.json()
    setQuestion(data.questions[0])
    setLoading(false)
  }

  async function submitAnswer() {
    setLoading(true)
    const res = await fetch(`${API}/api/evaluate-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question.question, answer, role })
    })
    const data = await res.json()
    setFeedback(data.feedback)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#1a1a2e" }}>🎯 AI Interview Prep</h1>
      <p style={{ color: "#666" }}>Practice interviews with AI-powered feedback</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
          <option>Software Engineer</option>
          <option>Product Manager</option>
          <option>Data Scientist</option>
          <option>UX Designer</option>
          <option>DevOps Engineer</option>
        </select>

        <select value={level} onChange={e => setLevel(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
          <option>Junior</option>
          <option>Mid-level</option>
          <option>Senior</option>
        </select>

        <select value={qType} onChange={e => setQType(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
          <option value="behavioral">Behavioral</option>
          <option value="technical">Technical</option>
          <option value="situational">Situational</option>
        </select>

        <button onClick={getQuestion} disabled={loading}
          style={{ padding: "8px 20px", borderRadius: 8, background: "#4f46e5", color: "white", border: "none", cursor: "pointer", fontSize: 14 }}>
          {loading ? "Loading..." : "Get Question"}
        </button>
      </div>

      {question && (
        <div style={{ background: "#f8f9ff", padding: 20, borderRadius: 12, marginBottom: 20, border: "1px solid #e0e0ff" }}>
          <p style={{ fontWeight: 600, fontSize: 16, margin: "0 0 16px" }}>{question.question}</p>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{ width: "100%", height: 120, padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          <button onClick={submitAnswer} disabled={loading || !answer}
            style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, background: "#16a34a", color: "white", border: "none", cursor: "pointer", fontSize: 14 }}>
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </div>
      )}

      {feedback && (
        <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid #e0e0e0" }}>
          <h2 style={{ margin: "0 0 16px" }}>Score: {feedback.score}/10 {feedback.score >= 7 ? "🟢" : feedback.score >= 5 ? "🟡" : "🔴"}</h2>
          <p style={{ color: "#555" }}>{feedback.summary}</p>
          <h3 style={{ color: "#16a34a" }}>✅ Strengths</h3>
          <ul>{feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h3 style={{ color: "#dc2626" }}>⚠️ Weaknesses</h3>
          <ul>{feedback.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}</ul>
          <h3 style={{ color: "#4f46e5" }}>💡 Ideal Answer Hint</h3>
          <p style={{ color: "#555" }}>{feedback.ideal_hint}</p>
        </div>
      )}
    </div>
  )
}