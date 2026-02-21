import { useState , useEffect} from 'react'
import './App.css'
import useSound from 'use-sound';
import fs from './assets/1.mp3';
import ss from './assets/2.mp3';
import ts from './assets/3.mp3';
import frs from './assets/4.mp3';
import ffs from './assets/5.mp3';

function App() {
  
  //its unreadable

  const [maxtime1,setMax1]=useState(25*60);
  const [maxtime2,setMax2]=useState(5*60);
  const [time1,setTime1]=useState(25*60);
  const [time2,setTime2]=useState(5*60);
  const [mode,setMode]=useState(1); //1 - pomodoro ; 2 - break
  const [active,setActive]=useState(false);
  const [session,setSession]=useState(1);
  const [stopses,setStop]=useState(3);
  const [[play1],[play2],[play3],[play4],[play5],]=
              [useSound(fs),useSound(ss),useSound(ts),useSound(frs),useSound(ffs),];

  useEffect(()=>{

    let interval=undefined;

    if(active && session<=stopses){
      interval=setInterval(()=>{
        if(mode===1){
          setTime1(prevTime=>{
            if (prevTime<=0){
              setMode(2);
              setTime2(maxtime2);
              if (session==stopses){play5()} 
              else{if(session==1){play1()} else if(session==2){play2()} else if(session==3){play3()}
                    else if(session==4){play4()}else if(session>4&&session<stopses){play4()} }//XD
              return 0;
            }
            //console.log("Вызов settime1")
            return prevTime-1;
          })
        } else {
          setTime2(prevTime=>{
            if (prevTime<=0){
              setMode(1);
              setTime1(maxtime1);
              //console.log('Вызываем setSession');
              if(stopses>session){
                setSession(prev=>prev+1);} else {
                  
                  setActive(false);
                }
              return 0;
            }
            return prevTime-1;
          })
        }
    },1000)}


    return ()=>clearInterval(interval);
    
  },[active,mode,stopses,session,maxtime1,maxtime2])

  const toggleTimer=()=>{
    //turn off
    setActive(!active);
  }

  return (
    <>
      <div className='app'>
      <div className='input'>
        <TimeInput setMax1={setMax1} setMax2={setMax2}></TimeInput>
      </div>
        <div className='buttons'>
          <span className='flex-1 text-2xl text-center'>Session: <input placeholder={`${session? session.toString():'1'}`} 
                className='w-14 -webkit-appearence-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                            [&::-webkit-inner-spin-button]:appearance-none' 
                type='number' value={session} 
                    onChange={(e)=>{
                          setSession(parseInt(e.target.value));
                          
                      }}> 
            </input>
          </span>
          <Pomodoro active={active} time={mode===1? time1 : time2} mode={mode} toggle={toggleTimer}></Pomodoro>
          <ResetButton setMode={setMode} maxtime1={maxtime1} setTime={setTime1} toggle={setActive}></ResetButton>
        </div>
      <div>
        <StopSession setStop={setStop}></StopSession>
      </div>
      </div>
    </>
  )
}

function TimeInput({setMax1,setMax2}) {
  


  return (
    <>
      <span className='text-2xl'><input className='w-14 border-2 border-red-500 rounded' placeholder="25" onChange={(e:any)=>setMax1(e.target.value!==''&&e.target.value>0? Math.floor(e.target.value*60):1500)}></input> min</span>
      <span className='text-2xl'><input className='w-14 border-2 border-green-500 rounded' placeholder="5" onChange={(e:any)=>setMax2(e.target.value!==''&&e.target.value>0? Math.floor(e.target.value*60):300)}></input> min</span>
      
    </>
  )
}

function Pomodoro({time,mode,toggle,active}) {
  
  //big red button
  
  const minute=String(Math.floor(time/60)).padStart(2, '0');
  const seconds=String(time-60*Math.floor(time/60)).padStart(2, '0');

  return (
    <>

      <button className={`active:w-50 active:h-50 w-40 h-40 hover:w-45 hover:border-8 
                    hover:h-45 rounded-full text-white
                     font-bold text-2xl shadow-xl transition-all duration-200 
                  ${mode===2 ? `${active===true ? 'border-8 border-red-500':'hover:border-8 hover:border-red-500'} bg-green-600 hover:bg-green-500` : 
                  `${active===true ? 'border-8 border-green-500':'hover:border-8 hover:border-green-500'} bg-red-600 hover:bg-red-700`}
      `}//if active red mode -> red button with green borders and vice versa; deactivated -> without borders
      onClick={toggle}>{minute}:{seconds}</button>

    </>
  )

}
function StopSession({setStop}){
  
  //input for final session

  return(
    <>
    <div className='text-center text-2xl'>Stop after<br></br>
    <input className='w-10 text-center' placeholder='3' onChange={(e)=>setStop(e.target.value)}></input>
    <br></br>
    sessions
    </div>
    </>
  )
}
function ResetButton({setTime,setMode,maxtime1,toggle}){
  
  const reset=()=>{
    setTime(maxtime1);
    setMode(1);
    toggle(false);
  }

  return(
    <>
    <button className='flex-1 text-4xl hover:text-5xl transition-all duration-300'onClick={reset}>reset</button>
    </>
  )
}

export default App




