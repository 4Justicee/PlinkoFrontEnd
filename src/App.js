import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { ToastContainer } from 'react-toastify';  
import { toast } from 'react-toastify';
import Pyramid from "./components/Pyramid/Pyramid";
import Menu from "./components/Menu/Menu";
import Balance from "./components/Balance/Balance";
import Error from "./components/Error/Error";


import { initGame, startBet, reloadBalance } from "./store/gameSlice";
import { delay } from "./utils/util";

import "./App.css";

import 'react-toastify/dist/ReactToastify.css';  

class Node {
  constructor(data) {
    this.data = data;
    this.nextLeft = null;
    this.nextRight = null;
  }
}

class LinkedList {
  constructor(head = null) {
    this.head = head;
  }
}

const App = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState(0)
  const [rows, setRows] = useState(8)
  const [betAmount, setBetAmount] = useState(1)
  const [numOfAutoBets, setNumOfAutoBets] = useState(10)
  const [risk, setRisk] = useState(1)
  const [autoBet, setAutoBet] = useState(false)
  const [betStarted, setBetStarted] = useState(false)

  const store = useSelector(state=>state.game)
  const multipliers = store.multipliers
  const balances = store.balances
  const currency = store.currency

  let rowCount = 1; 
    
  useEffect(()=>{
    dispatch(initGame({
      rows,
      risk
    }));
  },[dispatch, rows, risk])

  const mainNode = new Node(0);
  const list = new LinkedList(mainNode);

  let tempOldNodeArr = [mainNode];
  let tempNewNodeArr = [];
  let nodeArr = [];

  let ctr = 1;
  if(multipliers.length > 0) {
    for (let i = 0; i < rows + 2; i++) {
      for (let j = 0; j < rowCount + 1; j++) {
        tempNewNodeArr.push(new Node(ctr));
        ctr += 1;
      }
      for (let k = 0; k < rowCount; k++) {
        tempOldNodeArr[k].nextLeft = tempNewNodeArr[k];
        tempOldNodeArr[k].nextRight = tempNewNodeArr[k + 1];
      }
      nodeArr.push(tempOldNodeArr);
      tempOldNodeArr = [...tempNewNodeArr];
      tempNewNodeArr = [];
      rowCount += 1;
    }
    tempOldNodeArr[0].data = null;
    tempOldNodeArr[tempOldNodeArr.length - 1].data = null;
    for (let i = 0; i + 1 < tempOldNodeArr.length - 1; i++) {
      tempOldNodeArr[i + 1].data = multipliers[i];
    }
    tempOldNodeArr.shift();
    tempOldNodeArr.pop();
  }


  const handleBetAmount = (e) => {
    setBetAmount(parseFloat(e.target.value));
  };

  const handleAutoBet = (e) => {
    e.target.id === "auto" ? setAutoBet(true) : setAutoBet(false);
  };

  const handleRisk = (e) => {
    switch (e.target.value) {
      case "low":
        setRisk(0);
        break;
      case "medium":
        setRisk(1);
        break;
      case "high":
        setRisk(2);
        break;
      default:
        break;
    }
  };

  // betting function
  const randomTraverse = async () => {
    if (!betStarted) {
      const found = balances.find(item => item.currency === currency);  
      const balance = found ? found.balance : 0; 

      if(currency == "") {
        setError(1);
        await delay(2000);
        setError(0);
        return;
      }     

      if (betAmount > balance) {
        // add popup here        
        setError(2);
        await delay(2000);
        setError(0);
        return;
      }

      dispatch(startBet({
        betAmount,
        risk,
        rows
      })).then(async e=>{
      
        if(e.payload.bet_status == 1) {
          setBetStarted(true);

          await delay(2000);
 
          dispatch(reloadBalance({}));
          setBetStarted(false);          
        }
      });
    }
  };

  

  const automatedTraverse = async () => {
    const found = balances.find(item => item.currency === currency);  
    const balance = found ? found.balance : 0; 

    if(currency == "") {
      setError(1);
      await delay(2000);
      setError(0);
      return;
    }  

    if (betAmount * numOfAutoBets > balance) {
      setError(2);
      await delay(2000);
      setError(0);
      return;
    }
    
    for (let i = 0; i < numOfAutoBets; i++) {
      const e = await dispatch(startBet({
        betAmount,
        risk,
        rows
      }));
      
      if(e.payload.bet_status == 1) {
        setBetStarted(true);

        await delay(2000);

        await dispatch(reloadBalance({}));
        setBetStarted(false);          
      }

      await delay(1000);
    }
  };

  const handleRows = (e) => {
    setRows(Number(e.target.value));
  };

  const handleNumOfAutoBets = (e) => {
    setNumOfAutoBets(e.target.value);
  };

  const halfBet = () => {
    setBetAmount(betAmount / 2);
  };

  const doubleBet = () => {
    setBetAmount(betAmount * 2);
  };

  return (
    <div className='app'>
      <ToastContainer theme="dark"/>  
      <div>
        <Balance />
        <Menu
          handleAutoBet={handleAutoBet}
          handleBetAmount={handleBetAmount}
          autoBet={autoBet}
          handleRisk={handleRisk}
          handleRows={handleRows}
          handleNumOfAutoBets={handleNumOfAutoBets}
          halfBet={halfBet}
          doubleBet={doubleBet}
          betAmount={betAmount}
          randomTraverse={randomTraverse}
          automatedTraverse={automatedTraverse}
          betStarted={betStarted}
        />
      </div>
      <Pyramid
        rows={rows}
        nodeArr={nodeArr}
        tempOldNodeArr={tempOldNodeArr}
        betStarted={betStarted}
      />
      <div className='error-module'>
        <Error error={error} />
      </div>
    </div>    
  );
};

export default App;
