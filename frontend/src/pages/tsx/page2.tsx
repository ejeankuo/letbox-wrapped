import '../css/page2.css';
import { useEffect } from 'react';

export default function Page2() {
    useEffect(() => {
        // change background color just for this page
        document.body.style.backgroundColor = "#F5D7A4";

        return () => {
            document.body.style.backgroundColor = "";
        }
    }, []);

    return (
        // placeholder content
        <h1 className="title">Page 2</h1>
    )
}