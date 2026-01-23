import "../css/homepage.css";
import "./page2.tsx"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Homepage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // call backend
    const handleSubmit = async () => {
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${username}`)

            if (!res.ok) {
                throw new Error("User not found");
            }

            const data = await res.json();
            
            // navigate to page2 with data
            navigate("/page2", { state: { user: data } 
            });
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <>
            <h1>Letterboxd Wrapped 2026</h1>
            <h2>Find your year in movies, wrapped.</h2>
            <div className="input-form">
                <label htmlFor="username">Enter your Letterboxd username:</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                <button onClick={handleSubmit}>Get my wrapped</button>
                {/* {result && <p className="result">{result}</p>} */}
                {error && <p className="error">{error}</p>}
            </div>
        </>
    )
}