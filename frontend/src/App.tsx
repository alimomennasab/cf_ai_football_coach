import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [playcall, setplaycall] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    down: 1,
    distance: '',
    yardLine: 50,
    quarter: 1,
    timeMinutes: '',
    timeSeconds: '',
    ourScore: '',
    theirScore: '',
    weather: 0,
    additionalInfo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setplaycall(null);
    try {
      const res = await fetch(`${API}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      setplaycall(data.playcall || "No playcall returned.");

    } finally {
      setLoading(false);
    }
  };

    const handleReset = () => {
    setplaycall(null);
    setFormData({
      down: 1,
      distance: '',
      yardLine: 50,
      quarter: 1,
      timeMinutes: '',
      timeSeconds: '',
      ourScore: '',
      theirScore: '',
      weather: 0,
      additionalInfo: '',
    });

    // scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playcallRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (playcall && playcallRef.current) {
      playcallRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [playcall]);


  return (
    <div style={styles.page}>
      {loading && (
        <div
          style={styles.loadingOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-title"
        >
          <div style={styles.loadingCard}>
            <div style={styles.spinner} aria-hidden="true" />
            <div>
              <h2 id="loading-title" style={styles.loadingTitle}>Generating playcall…</h2>
              <p style={styles.loadingSub}>
                Reading the situation and weighing options.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <h1 style={styles.header}>🏈 AI Football Coach</h1>
        <p style = {{color:'black', fontStyle: 'italic', textAlign: 'center'}}>
          Give me the scenario, I'll give you a play 
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Down */}
          <label style={styles.label}>
            Down: <strong>{formData.down}</strong>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              name="down"
              value={formData.down}
              onChange={e => handleSliderChange('down', Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.ticks}>
              {[1, 2, 3, 4].map(val => <span key={val} style={styles.tick}>{val}</span>)}
            </div>
          </label>

          {/* Distance */}
          <label style={styles.label}>
            Distance to First Down (yds):
            <input
              type="number"
              name="distance"
              min={0}
              max={100}
              value={formData.distance}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          {/* Field Position */}
          <label style={styles.label}>
            Field Position (Yard Line): <strong>{formData.yardLine}</strong>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              name="yardLine"
              value={formData.yardLine}
              onChange={e => handleSliderChange('yardLine', Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.ticks}>
              {[0, 25, 50, 75, 100].map(val => <span key={val} style={styles.tick}>{val}</span>)}
            </div>
          </label>

          {/* Quarter */}
          <label style={styles.label}>
            Quarter: <strong>{formData.quarter}</strong>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              name="quarter"
              value={formData.quarter}
              onChange={e => handleSliderChange('quarter', Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.ticks}>
              {[1, 2, 3, 4].map(val => <span key={val} style={styles.tick}>{val}</span>)}
            </div>
          </label>

          {/* Time Remaining */}
          <label style={styles.label}>
            Time Remaining in Quarter:
            <div style={styles.row}>
              <input
                type="number"
                name="timeMinutes"
                placeholder="Min"
                min={0}
                max={12}
                value={formData.timeMinutes}
                onChange={handleChange}
                style={styles.timeInput}
              />
              <input
                type="number"
                name="timeSeconds"
                placeholder="Sec"
                min={0}
                max={59}
                value={formData.timeSeconds}
                onChange={handleChange}
                style={styles.timeInput}
              />
            </div>
          </label>

          {/* Score */}
          <label style={styles.label}>
            Score (Us / Them):
            <div style={styles.row}>
              <input
                type="number"
                name="ourScore"
                placeholder="Us"
                value={formData.ourScore}
                onChange={handleChange}
                style={{ ...styles.input, marginRight: 10 }}
              />
              <input
                type="number"
                name="theirScore"
                placeholder="Them"
                value={formData.theirScore}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </label>

          {/* Weather */}
          <label style={styles.label}>
            <strong>{["Fair", "Light Rain", "Heavy Rain", "Light Snow", "Heavy Snow"][formData.weather]}</strong>
            <input
              type="range"
              min={0}
              max={4}
              name="weather"
              value={formData.weather}
              onChange={e => handleSliderChange('weather', Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.ticks}>
              {["Fair", "Light Rain", "Heavy Rain", "Light Snow", "Heavy Snow"].map((val) => (
                <span key={val} style={styles.tick}>{val}</span>
              ))}
            </div>
          </label>

          {/* Additional Info */}
          <label style={styles.label}>
            Additional Info (Injuries, context, etc.):
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={3}
              style={styles.textarea}
            />
          </label>

          <button type="submit" style={styles.button}>Submit Situation</button>
        </form>

        {playcall && (
          <div>
            <div ref={playcallRef} style={styles.playcallDiv}>
              <ReactMarkdown>{playcall}</ReactMarkdown>
            </div>
            <button onClick={handleReset} type="submit" style={styles.button}>Reset Playcall</button>
          </div>

          // <div ref={playcallRef} style={styles.playcallDiv}>
          //   <ReactMarkdown>{playcall}</ReactMarkdown>
          //   <button onClick={handleReset} type="submit" style={styles.button}>Reset Playcall</button>
          // </div>
        )}

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: 600,
  },
  header: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#222',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  timeInput: {
    padding: '0.5rem',
    fontSize: '0.9rem',
    width: '10rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    color: '#333',
    textAlign: 'center',
  },
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  slider: {
    width: '100%',
    marginTop: '0.5rem',
    appearance: 'none',
    height: '6px',
    backgroundColor: '#ddd',
    borderRadius: 4,
    outline: 'none',
    accentColor: '#2a7cf7',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    backgroundColor: '#2a7cf7',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    transition: '0.2s ease-in-out',
    width: '100%'
  },
  ticks: {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 4px',
  marginTop: '4px',
  fontSize: '0.85rem',
  color: '#666',
  },

  tick: {
    position: 'relative',
    textAlign: 'center',
    width: '1rem',
  },
  loadingDiv: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'black',
    fontStyle: 'bold',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  playcallDiv: {
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: 12,
    background: "#f4f7ff",
    border: "1px solid #dbe5ff",
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
    color: 'black',
  },
  loadingOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },

  loadingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem 1.5rem',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.9)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.6)',
  },

  spinner: {
    width: 28,
    height: 28,
    border: '3px solid rgba(42,124,247,0.25)',
    borderTopColor: '#2a7cf7',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },

  loadingTitle: {
    margin: 0,
    color: '#111827',
    fontSize: '1rem',
    fontWeight: 700,
  },

  loadingSub: {
    margin: 0,
    color: '#4b5563',
    fontSize: '0.9rem',
  },
};
