import React, { useEffect, useState } from "react";
import Square from "./Square";
import { ethers } from "ethers";
import { useDispatch, useSelector } from 'react-redux';
import { setPlayer1Address, setPlayer2Address } from "../Redux/DataSlice";
import ClaimReward from "./ClaimReward";
import { utils } from "web3";



function Board({gameId,comingFrom,player2Joined}) {
	const [squares, setSquares] = useState(Array(9).fill(null));	
	const contract = useSelector((state) => state.data.contract);
	const webSocketContract = useSelector((state) => state.data.webSocketContract);
	const provider = useSelector((state) => state.data.webSocketContract);
	const player1Address=useSelector((state)=>state.data.player1Address)
	const player2Address=useSelector((state)=>state.data.player2Address)
	const[rounds, setRounds]=useState(0)
	const[whichPlayer,setWhichPlayer]=useState('')
	const[makeUnClickable,setMakeUnClickable]=useState(false)
	const[win, setWin]=useState(-1)
	const ethers = require('ethers')
	const dispatch=useDispatch()

	useEffect(()=>{
		
		console.log(comingFrom)
		if(comingFrom==='start'){setWhichPlayer(player1Address); setMakeUnClickable(false)}
		else {setWhichPlayer(player2Address); setMakeUnClickable(true)}
	
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
			console.log(player1)
		}
		const handleMadeMove= (gameId,x,y, player) => {
			
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
			setRounds(rounds=>rounds+1)
			// Toggle whichPlayer based on the move made
			setWhichPlayer(player === player1Address ? player2Address : player1Address);
			setMakeUnClickable(comingFrom==='start'?(player===player1Address?true:false):(player===player2Address?true:false)); // Re-enable clicking after the move is handled
	
			
			
		};
		const handleWinner= (gameId, winner, reward) => {
			console.log("BoardHaveWinner")
			console.log(`hey this is gameId: ${gameId} and the winner is ${winner} and the amount is ${reward}`)
			setWin(winner)
			setMakeUnClickable(true)

		}

		webSocketContract.on('JoinedGame',handleJoinedGame)
		webSocketContract.on('GameStarted',handleGameStarted)
		webSocketContract.on('MadeMove', handleMadeMove);
		webSocketContract.on('HaveWinner',handleWinner)
		// webSocketContract.on('GameCancelled',(gameId,player1)=>{
		// 	console.log("BoardGameCancelled")
		// });
				

		return () => {
			webSocketContract.off('JoinedGame', handleJoinedGame);
			webSocketContract.off('GameStarted', handleGameStarted);
			webSocketContract.off('MadeMove', handleMadeMove);
			webSocketContract.off('HaveWinner', handleWinner);
			// ... unsubscribe from other events ...
		};

	},[])


	const makeMove = async (x,y,squares) => {
		console.log(x,y)
		if (contract) {
			try {
				
			
				
				const transaction = await contract.makeMove(x,y,gameId);
				console.log(`Transaction mined with ${transaction} confirmations`);
					
				
			} catch (error) {
				console.error("Failed to make move:", error);
				setMakeUnClickable(false)
			}
		}
	};

	const handleWinner=async()=>{
		if(contract){
			try{
				 // Sending the transaction
				 console.log(typeof gameId)
				 const overrides = {
					value: '2000'
					};
					// ethers.utils.parseUnits(amountInEther, "ether");
				 const transaction = await  contract.claimRewards(ethers.toBigInt('2000'));
				 
				//  const receipt = await transaction.wait();
				 console.log(transaction)
			}
			catch(error){console.log("Failed to send the rewards "+error)}
		}
	}

	
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
				console.log("winner mil gya")
				
				return squares[a];
			}
		}
		return null;
	}

	const renderSquare = (i) => {
		return <Square value={squares[i]} onClick={() =>handleClick(i)} makeUnClickable={makeUnClickable} />;
	};

	const winner = calculateWinner(squares);
	// const status = winner ? `Winner: ${winner}` : `Next	 Move: ${isXNext ? "X" : "O"}`;

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
				{console.log(typeof Number(win))}
				{ 
				Number(win)===-1?(comingFrom==="start"?(rounds%2===0?"Your Turn":"Let the Player 2 make a move")
									:(rounds%2===0?"Let the Player 1 to make a move":"Your Turn"))
					:( Number(win)===1?(comingFrom==="start"?<ClaimReward click={handleWinner}/>:"You Lost it!")
						:( Number(win)===2?(comingFrom==="start"?"You Lost it!":<ClaimReward click={handleWinner}/>)
							:( Number(win)===3&&"Its a draw")))
				}
				</div>
			</div>
		</div>
	);
}


export default Board;