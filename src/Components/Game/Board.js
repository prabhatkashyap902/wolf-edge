import React, { useState } from "react";
import Square from "./Square";
import { useSelector } from 'react-redux';

function Board({gameId,player,comingFrom,secondCome}) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const contract = useSelector((state) => state.data.contract);
  // const makeMove = async (moveX,moveY, gameId) => {
  //   if (contract) {
  //     try {
  //       const transaction = await contract.makeMove(moveX,moveY,gameId);
  //       console.log(gameId,moveX,moveY)
  //       await transaction.wait();
  //       console.log("Move made:", moveX);
  //     } catch (error) {console.log(gameId,moveX,moveY)
  //       console.error("Failed to make move:", error);
  //     }
  //   }
  // };

  const handleClick = (i) => {
    console.log(i)
    const newSquares = squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = isXNext ? "X" : "O";
    // makeMove(Math.ceil(i/3),i%3,gameId)
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

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
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next Move: ${isXNext ? "X" : "O"}`;

  return (
    <div className="flex flex-col justify-center">
      <div>{comingFrom==="start"?
              (secondCome===true?(<>Player 2 successfully Joined The game</>):<>Let the Player 2 Join! Send this GameId: {gameId} to Player2</>)
              :
              (<>Welcome </>)}</div>
      <div className="w-64 h-64 grid grid-cols-3">
        {Array(9).fill(null).map((_, i) => (
          <div key={i} className="w-full h-full">
            {renderSquare(i)}
          </div>
        ))}
        <div className="col-span-3 mt-4 text-center">
          {status}
        </div>
      </div>
    </div>
  );
}

// Add the calculateWinner function here...

export default Board;
