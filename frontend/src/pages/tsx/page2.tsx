import '../css/page2.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Page2() {
    useEffect(() => {
        // change background color just for this page
        document.body.style.backgroundColor = "#F5D7A4";

        return () => {
            document.body.style.backgroundColor = "";
        }
    }, []);

    const { state } = useLocation();
    const user = state?.user;

    if (!user) {
        return <p>Error: no data</p>
    }

    return (
        <div className="page2">
            <h1>{user.username}</h1>
            <h2>Here's what we know about you: {user.bio}</h2>
            <h2>Your most recent review: "{user.mostRecentReview}"</h2>
        </div>
    )
}