import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';

// reusable framer motion transitions
const spring: Transition = { type: "spring", stiffness: 100 }

const MoveUp = (init_y: number, animate_y: number, delay: number) => ({
    initial: { y: init_y },
    animate: { y: animate_y},
    transition: { ...spring, delay: delay }
});

const SlideInLeft = (delay: number) => ({
    initial: { y: 0, x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { ...spring, delay: delay }
});

export default function Page3() {
    const { state } = useLocation();
    const user = state?.user;
    if (!user) return <p>Error: no data</p>;

    
    // format one movie as 'idx. title'
    // returns a string
    function FaveMovie(idx: number, item: string) { 
        return (
            `${idx}. ${item}`
        )
    }

    const favorites_str = function() {
        let start_idx = user.bio.indexOf("Favorites: ") + 11;
        let end_idx = user.bio.indexOf(").") + 1;
        return user.bio.slice(start_idx,end_idx);
    }();
    
    // turn into array so we can map it
    let favorites_arr = favorites_str.split(",");

    // getting rid of the year that some movie titles have
    let faves_no_year = []
    for (let movie of favorites_arr) {
        if (movie.includes("(" && ")")) { 
            let idx = movie.indexOf("(");
            faves_no_year.push(movie.slice(0,idx));
        } else {
            faves_no_year.push(movie);
        }
    }
    //console.log(faves_no_year);

    useEffect(() => {
        document.body.style.backgroundColor = "#7E6072";

        return () => {
            document.body.style.backgroundColor = "";
        }
    },[]);

    if (favorites_str === "") {
        return (
            <>
                <motion.h1 {...MoveUp(0,-130,0)}>You don't have any favorite films...</motion.h1>
                <motion.div {...MoveUp(0,-100,4.5)}>
                    <motion.h1 {...SlideInLeft(1)}>I get it though.</motion.h1>
                    <motion.h2 {...SlideInLeft(2)}> I also have commitment issues sometimes.</motion.h2>
                    <motion.h2 {...SlideInLeft(3.5)}> ...Just kidding.</motion.h2>
                </motion.div>
            </>
        )
    }

    return (
        <>
            <motion.h1 {...MoveUp(0,-120,0)}>So you say that these are your favorite movies of all time...</motion.h1>
            <motion.h2 {...MoveUp(0,-100,5)}>
                {faves_no_year.map((item: string, idx: number) =>  (
                    <motion.div {...SlideInLeft(idx+1)}>{FaveMovie(idx+1,item)}</motion.div>
                ))} 
            </motion.h2>
            <motion.h1 {...SlideInLeft(6)}>But these movies came a close second...or fourth...or fifth?</motion.h1>
        </>
    )
}