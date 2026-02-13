import '../css/page2.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';

// reusable framer motion transitions
const spring: Transition = { type: "spring", stiffness: 100 }

const MoveUp = (init_y: number, animate_y: number, delay: number) => ({
    initial: { y: init_y },
    animate: { y: animate_y },
    transition: { ...spring, delay: delay }
});

const SlideInLeft = (delay: number) => ({
    initial: { y: 0, x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { ...spring, delay: delay }
});

// page 2 major component
export default function Page2() {
    const [message, setMessage] = useState("");
    const [singleTense, setSingleTense] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();
    
    // access data we sent from homepage
    const user = state?.user;
    // quick check to make sure user exists
    if (!user) return <p>Error: no data</p>;

    // grab just the num of films from bio string
    const num_films: number = (() => {
        const start_idx = user.bio.indexOf('and lists.') + 11;
        const first_film = user.bio.indexOf('film');
        const end_idx = user.bio.indexOf(' film', first_film + 1)
        return Number(user.bio.slice(start_idx,end_idx));
    })();
    
    // change background color just for this page
    useEffect(() => {
        document.body.style.backgroundColor = "#F5D7A4";

        return () => {
            document.body.style.backgroundColor = "";
        }
    }, []);

    useEffect(() => {
        if (num_films === 1) {
            setSingleTense(true);
        }
        if (num_films < 10) { // 50 is not that many movies, sorry
            setMessage("Dude. There's no way that's true.")
        } else if ((10 <= num_films) && (num_films < 50)) { // btwn 10 and 49 movies watched
            setMessage("Awww you're just a baby :(")
        } else if ((50 <= num_films) && (num_films < 100)) { // btwn 50 and 99 movies watched
            setMessage("I mean... I guess...that's fine...")
        } else if ((100 <= num_films) && (num_films < 250)) { // btwn 100 and 249
            setMessage("That's a good amount! I'd trust you for a movie rec.")
        } else { // more than 250 is lowkey crazy
            setMessage("That's a lot. I kinda don't believe you.")
        }
    },[]);

    return (
        <div className="page2">
            <motion.div className='intro-text' {...MoveUp(20,-30,0)}>
                <h1>Hey, @{user.username}!</h1>
                <h2>Let's get the easy stuff out of the way.</h2>
            </motion.div>
            <motion.div className='movies-watched' {...MoveUp(20,-10,3.8)}>
                {singleTense && <motion.h1 {...SlideInLeft(1.5)}>You've watched <span style={{ color: '#D48E16', display: 'inline-block' }}> {num_films} </span> movie.</motion.h1>}
                {!singleTense && <motion.h1 {...SlideInLeft(1.5)}> You've watched <span style={{ color: '#D48E16', display: 'inline-block' }}> {num_films} </span> movies. </motion.h1>}
                <motion.h2 {...SlideInLeft(2.5)}> {message} </motion.h2> <br/>
            </motion.div>
            <div className="recent-review">
                <motion.h1 {...SlideInLeft(5)}> Your most recent review was for: </motion.h1>
                <motion.h1 {...SlideInLeft(6)} style={{ color: '#D48E16' }}>{user.mostRecentMovie}</motion.h1>
                <motion.h2 {...SlideInLeft(7)}> And you said...</motion.h2><br/>
                <motion.h2 {...SlideInLeft(8)}>"{user.mostRecentReview}"</motion.h2><br/>
                <motion.h2 {...SlideInLeft(9.5)}> Interesting...</motion.h2>
            </div>
            <br/>
            <motion.button 
                {...SlideInLeft(10.5)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                transition={{
                  x: { ...spring, delay: 10.5 },
                  opacity: { ...spring, delay: 10.5 },
                  scale: { duration: 0.12 },
                }}
                onClick={() => navigate('/page3', { state: { user }})}
            >
                Continue
            </motion.button>
        </div>
    )
}