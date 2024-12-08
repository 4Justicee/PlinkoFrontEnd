import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import Pyramid from "./components/Pyramid/Pyramid";
import Menu from "./components/Menu/Menu";
import Balance from "./components/Balance/Balance";
import Error from "./components/Error/Error";


import { initGame } from "./store/gameSlice";
import { delay } from "./utils/util";

import "./App.css";

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

  const [error, setError] = useState(false)
  const [rows, setRows] = useState(8)
  const [betAmount, setBetAmount] = useState(1)
  const [numOfAutoBets, setNumOfAutoBets] = useState(10)
  const [risk, setRisk] = useState(0)
  const [autoBet, setAutoBet] = useState(false)

  const store = useSelector(state=>state.game)
  const multipliers = store.multipliers
  const balance = store.balance
  const betStarted = store.betStarted

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
    //e.target.id === "auto" ? setAutoBet(true) : setAutoBet(false);
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
      let multiplier = 0;
      if (betAmount > balance) {
        // add popup here
        console.log("cannot be");
        setError(true);
        await delay(2000);
        setError(false);
        return;
      }
      const headDup = list.head;
      let path = [];
      //setBetStarted(true);
      while (list.head) {
        multiplier = list.head.data;
        if (Math.random() > 0.5) {
          list.head = list.head.nextLeft;
          path.push(-1);
        } else {
          list.head = list.head.nextRight;
          path.push(1);
        }
      }

      path.pop();
      //setBetPath(path);

      await delay(1200);
      /*await setBalance(
        (balance) => balance - betAmount + betAmount * multiplier
      );*/
      //await setBetStarted(false);
      list.head = headDup;

    }
  };

  

  const automatedTraverse = async () => {
    if (betAmount * numOfAutoBets > balance) {
      // add popup here
      console.log("cannot be");
      setError(true);
      await delay(2000);
      setError(false);
      //setBetStarted(false);
      return;
    }
    //setBetStarted(true);
    for (let i = 0; i < numOfAutoBets; i++) {
        randomTraverse();
        await delay(1200);
    }
    //setBetStarted(false);
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
      />
      <div className='error-module'>
        <Error error={error} />
      </div>
    </div>    
  );
};

export default App;
