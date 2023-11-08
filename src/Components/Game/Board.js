import React, { useEffect, useState } from "react";
import Square from "./Square";
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer1Address, setPlayer2Address } from "../Redux/DataSlice";

function Board({gameId,player,comingFrom,player2Joined}) {
	const [squares, setSquares] = useState(Array(9).fill(null));	
	const contract = useSelector((state) => state.data.contract);
	const provider=useSelector((state)=>state.data.provider)
	const webSocketContract = useSelector((state) => state.data.webSocketContract);
	const player1Address=useSelector((state)=>state.data.player1Address)
	const player2Address=useSelector((state)=>state.data.player2Address)
	const[player1Play,setPlayer1Play]=useState(false)
	const[rounds, setRounds]=useState(0)
	const[whichPlayer,setWhichPlayer]=useState('')
	const[makeUnClickable,setMakeUnClickable]=useState(false)
	
const dispatch=useDispatch()
	useEffect(()=>{
		
		console.log(comingFrom)
		if(comingFrom==='start')setWhichPlayer(player1Address)
		else setWhichPlayer(player2Address)

		const handleJoinedGame = (gameId, player2) => {
			console.log("BoardJoinedGame")
			console.log(player2)
			dispatch(setPlayer2Address(player2))
			dispatch(setPlayer1Address(player1Address))
			
			console.log(player1Address)
			console.log(player2Address)
			console.log(whichPlayer)
			
		}
		const handleGameStarted = (gameId, player1, betAmount) => {
			console.log("BoardGameStarted")
			// setPlayer1Play(true)
			console.log(player1)
			// setWhichPlayer(player1)
		}
		const handleMadeMove= async(gameId,x,y, player) => {
			// console.log("BoardMadeMove")
			// console.log(`MadeMove of gameID ${gameId} of x:${x} and y:${y} by ${player}`)
			// console.log(whichPlayer)
			// console.log(player1Address)
			// console.log(player2Address)
			// Update the board state based on the move made
      // const newSquares = [...squares];
			setSquares((prevSquares) => {
				// Create a new array from the previous squares
				const newSquares = [...prevSquares];
				// Calculate the index in the squares array
				const index = Number(x) * 3 + Number(y);
				// Update the square with "X" or "O"
				newSquares[index] = player === player1Address ? "X" : "O";
				// Return the updated squares array
				return newSquares;
			});
      // setSquares(newSquares);

      // Toggle whichPlayer based on the move made
      setWhichPlayer(player === player1Address ? player2Address : player1Address);
      // setIsXNext(player !== player1Address); // If player 1 made a move, it's now player 2's turn, and vice versa
      setMakeUnClickable(false); // Re-enable clicking after the move is handled
    
			
			
		};

		webSocketContract.on('JoinedGame',handleJoinedGame)
		webSocketContract.on('GameStarted',handleGameStarted)
		webSocketContract.on('MadeMove', handleMadeMove);
		
		// webSocketContract.on('HaveWinner', (gameId, winner, reward) => {
		// 	console.log("BoardHaveWinner")
			
		// });
		// webSocketContract.on('GameCancelled',(gameId,player1)=>{
		// 	console.log("BoardGameCancelled")
		// });
				

		return () => {
			webSocketContract.off('JoinedGame', handleJoinedGame);
			webSocketContract.off('GameStarted', handleGameStarted);
			webSocketContract.off('MadeMove', handleMadeMove);
			// ... unsubscribe from other events ...
		};

	},[])


	const makeMove = async (x,y,squares) => {
		console.log(x,y)
		if (contract) {
			try {
				
			
				// webSocketContract.on('MadeMove', (gameId,x,y, player) => {
				// 	console.log("BoardMadeMove")
				// 	console.log(`MadeMove of gameID ${gameId} of x:${x} and y:${y} `)
				// 	if(player==player1Address){
						
				// 		setWhichPlayer(player2Address)
						
				// 		setSquares(squares);
				// 	}
				// 	else{
				// 		setWhichPlayer(player1Address)
						
				// 		setSquares(squares);
				// 	}
				// 		console.log(squares)
				// 		setSquares(squares);
				// 		setMakeUnClickable(false)
					
				// });
				const transaction = await contract.makeMove(x,y,gameId);
				// const receipt = await provider.waitForTransaction(transaction.hash);
				console.log(`Transaction mined with ${transaction} confirmations`);
					
				
			} catch (error) {
				console.error("Failed to make move:", error);
				setMakeUnClickable(false)
			}
		}
	};

	
	const handleClick =  (i) => {
		setMakeUnClickable(true)
		console.log(i);
		const newSquares = squares.slice();
		console.log(`Current player: ${whichPlayer}`);
		console.log(`Player 1 Address: ${player1Address}`);
		console.log(`Player 2 Address: ${player2Address}`);
		// Check if the game is over or the square is already taken
		if(player1Address===''||player2Address===''){ console.log("wow");setMakeUnClickable(false);return;}
		if (calculateWinner(newSquares) || newSquares[i]) {
			console.log("Oops block already filled!")
			setMakeUnClickable(false);
			return;
		}



		if (!squares[i]) {
      try {
        setMakeUnClickable(true); // Disable further clicks until the move is processed
        makeMove(Math.floor(i / 3), i % 3, squares);
      } catch (error) {
        console.error("Failed to make a move:", error);
        setMakeUnClickable(false); // Re-enable clicking if there's an error
      }
    }

		
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
		return <Square value={squares[i]} onClick={() =>handleClick(i)} makeUnClickable={makeUnClickable} setMakeUnClickable={setMakeUnClickable} />;
	};

	const winner = calculateWinner(squares);
	// const status = winner ? `Winner: ${winner}` : `Next Move: ${isXNext ? "X" : "O"}`;

	return (
		<div className="flex flex-col justify-center text-center">
			<div>{comingFrom==="start"?
							(player2Joined===true?(<>Player 2 successfully Joined The game</>)
								:
								<>{`Let the Player 2 Join! Send this GameId: ${gameId} to Player2`}</>)
							:
							(<>Welcome Player2 </>)}
			</div>
			<div>{`Game Id. ${gameId}`}</div>
			<div className="w-64 h-64 grid grid-cols-3">
				
				{Array(9).fill(null).map((_, i) => (
					<div key={i} className="w-full h-full">
						{renderSquare(i)}
					</div>
				))}
				<div className="col-span-3 mt-4 text-center">
					
				</div>
			</div>
		</div>
	);
}


export default Board;
