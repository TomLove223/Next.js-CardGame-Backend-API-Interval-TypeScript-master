import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect,useRef } from 'react';
export default function Home() {
  interface Cardprops {
    number:string;
    suit:string;
    color:string;
  }
  interface Buttonprops {
    backcolor : string;
    txtcolor : string;
    txt : string;
  }
  const Card = ({number, suit, color} : Cardprops) => {
    let cardcolor = '#fff'
    if(color == 'RED') cardcolor = "#F04051"
    if(color == 'BLACK') cardcolor = "#26292F"
    return(
      <div className={styles.card}>
        <div className={ styles.center}>
          <h2 style={{color : cardcolor}}>{number.slice(0,1)}</h2>
        </div>
        <div className={styles.cardImage}>
          <Image 
          src={`/${suit}.png`}
          alt="suit"
          width={60}
          height={65}
          priority
        />
        </div>
        
      </div>
    )
  }
  const Button = ({backcolor, txtcolor, txt} : Buttonprops) => {
    const handleClickEvent = (txt:string)=>{
      if(txt == "START")
        GameStart()
      else makeSpin(txt);
    }
    return(
      <button className={styles.button} style={{background : backcolor, color : txtcolor}} onClick={(e)=>{handleClickEvent(txt)}}>{txt}</button>
    )
  }
  const [newSpin, setNewSpin] = useState({} as any);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameState, setGameState] = useState(false);
  const [endState, setEndState] = useState(false);
  const flipTimer:any = useRef();
  const getGuess =async (txt:string) => {
    const res = await fetch("/api/make-spin", {
      method: "POST",
      body: JSON.stringify({
        guess: txt.toLowerCase()
      })
    })
    return (res.json())
  }

  const GameStart = () => {
    setGameState(true)
    setEndState(false)
  }
  const makeSpin = (txt:string) => {
    if(gameState == true){
      setGameState(false)
      getGuess(txt).then(data => {
        console.log(data)
        setIsCorrect(data.isCorrect)
        setNewSpin(data.card)
        setEndState(true)
        if(data.isCorrect == false)
        setTimeout(()=>{
          setEndState(false)
        }, 3000)
      })
    }
  }

  useEffect(() =>{
    let i:number = 0;
    const guessCard = document.getElementById('guessCard')
    if(gameState == true)
    flipTimer.current = setInterval(()=>{
      i++;
      if(guessCard)
      guessCard.style.transform = `rotateY(${i * 1}deg)`
    },10)
    else {
      if(guessCard)
      guessCard.style.transform = 'rotateY(0deg)'
      clearInterval(flipTimer.current);
    }
  },[gameState])
  return (
    <>
      <Head>
        <title>Patrianna Game Studio Task</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
          <div className={styles.grid}>
            {endState==true && newSpin?
            <div>
              <Card number={newSpin.value} suit={newSpin.suit} color={newSpin.color} />
            </div> 
            : 
            <div>
              <Image 
                id='guessCard'
                src='/card.png'
                className={styles.randomCard}
                alt="suit"
                width={144}
                height={200}
                priority
              />
            </div>
            }
            <Card number={'2'} suit={'DIAMONDS'} color={"RED"} />
            <Card number={'A'} suit={'SPADES'} color={"BLACK"} />
            <Card number={'10'} suit={'CLUBS'} color={"BLACK"} />
            <Card number={'7'} suit={'HEARTS'} color={"RED"} />
          </div>
          <div style={{display : 'flex', marginTop : '5rem'}}>
            <div>
              <div className={styles.TRCbutton}>
                <div style={{display : 'flex', flexDirection : 'column', justifyContent : 'space-between'}}>
                  <button className={styles.miniButton}>Min</button>
                  <button className={styles.miniButton}>Min</button>
                </div>
                <div style={{display : 'flex', alignItems : 'center', margin :" 10px 30px", color : "white"}}>
                    <Image 
                      src='/TRC.png'
                      className={styles.randomCard}
                      alt="trc"
                      width={24}
                      height={24}
                      priority
                    />
                  10.00
                </div>
                <div style={{display : 'flex', flexDirection : 'column', justifyContent : 'space-between'}}>
                  <button className={styles.miniButton}>1/2</button>
                  <button className={styles.miniButton}>2x</button>
                </div>
              </div>
            </div>
            <div>
            <Button backcolor={'#1B2233'} txtcolor = {"#FE0000"} txt = {"RED"}/>
            </div>
          </div>
          <div  style={{display : 'flex'}}>
            <div>
              <Button backcolor={'#2283F6'} txtcolor = {"white"} txt = {"START"}/>
            </div>
            <div>
              <Button backcolor={'#1B2233'} txtcolor = {"#297FE5"} txt = {"BLACK"}/>
            </div>
          </div>
          <div>
            {endState == true?
              isCorrect == true?
                <Image 
                  src='/success.png'
                  alt="success"
                  width={250}
                  height={100}
                  priority
                />
                :
                <Image 
                  src='/fail.png'
                  alt="fail"
                  width={250}
                  height={100}
                  priority
                />
              :
              <></>
            }
          </div>
      </div>
    </>
  )
}
