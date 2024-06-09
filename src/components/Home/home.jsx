import { useState,useEffect } from "react";


function Home(){
    const [color,setColor]=useState('initial');
    const [click,setClicks]= useState(0);

   useEffect(()=>{
    setClicks(100)
   },[])

    const handleClick=()=>{
        setColor('red');
    }
    return(
        <>
        <div>
            <h6>Welcome Home</h6>
            <button onClick={handleClick} style={{backgroundColor: color==='initial' ?'': color}} >Click Me</button>
            <button onClick={()=>setClicks((count)=>count+=1)}>Counts</button>

            <h4>{click}</h4>
        </div>
        </>
    )

}

export default Home;