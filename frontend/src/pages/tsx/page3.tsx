import { useEffect } from 'react';

export default function Page3() {
    useEffect(() => {
        document.body.style.backgroundColor = "#7E6072";

        return () => {
            document.body.style.backgroundColor = "";
        }
    },[]);

    return (
        <h1></h1>
    )
}