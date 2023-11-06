import React from 'react'
import Board from './Board'

const Game = ({gameId,player,comingFrom}) => {
  console.log(gameId,player,comingFrom)
  return (
    <div className='flex-1 flex items-center justify-center'>

    <Board gameId={gameId}  player={player} comingFrom={comingFrom}/>
  </div>
  )
}

export default Game