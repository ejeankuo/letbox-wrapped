import "../css/homepage.css";
import "./page2.tsx"
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();
    return (
        <div className="homepage">
            <h1>Letterboxd Wrapped 2026</h1>
            <h2>Find your year in movies, wrapped.</h2>
            <div className="input-form">
                <label htmlFor="username">Enter your Letterboxd username:</label>
                <input type="text" id="username" name="username" />
                <button onClick={ () => navigate('./page2')} type="submit">Get my wrapped</button>
            </div>
        </div>
    )
}