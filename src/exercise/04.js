// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentSquares, setCurrentSquares] = useLocalStorageState('squares', Array(9).fill(null));
  const [history, setHistory] = useLocalStorageState('history', [currentSquares]);
  const [currentStepIndex, setCurrentStepIndex] = useLocalStorageState('currentStepIndex', 0);

  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if (history.length !== currentStepIndex + 1) {
      const newHistory = history.slice(0, currentStepIndex + 1);
      setHistory(newHistory);
    }
  
    const squaresCopy = [...currentSquares];
  
    if (winner || currentSquares[square]) {
      return;
    }
  
    squaresCopy[square] = nextValue;
  
    setCurrentSquares(squaresCopy);
    setHistory(prev => [...prev, squaresCopy]);
    setCurrentStepIndex(currentStepIndex + 1);
  }

  function restart() {
    setCurrentSquares(Array(9).fill(null));
    setHistory([Array(9).fill(null)]);
    setCurrentStepIndex(0);
  }

  const History = ({index}) => {
    const isCurrentTurn = index === currentStepIndex;
  
    var text = 'Go to ';
    text += index === 0 ? 'game start' : `move #${index}`;
    text += isCurrentTurn ? ' (current)' : '';

    return (
      <li>
        <button 
          onClick={() => {
            setCurrentStepIndex(index);
            setCurrentSquares(history[index]);
          }} 
          disabled={isCurrentTurn}>{text}</button>
      </li>
    )
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ul>{history.map((_, index) => (
          <History key={`step-${index}`} index={index}/>
        ))}</ul>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
