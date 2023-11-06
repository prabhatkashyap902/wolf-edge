import React, { useEffect, useState } from "react";
import Square from "./Square";
import { useSelector } from 'react-redux';

function Board({gameId,player,comingFrom,player2Joined}) {
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [isXNext, setIsXNext] = useState(true);
	const contract = useSelector((state) => state.data.contract);
	const provider=useSelector((state)=>state.data.provider)
	const webSocketContract = useSelector((state) => state.data.webSocketContract);
	const player1Address=useSelector((state)=>state.data.player1Address)
	const player2Address=useSelector((state)=>state.data.player2Address)
	const[player1Play,setPlayer1Play]=useState(false)
	


	useEffect(()=>{
		webSocketContract.on('JoinedGame', (gameId, player2) => {
			console.log("BoardJoinedGame")
			setPlayer1Play(false)
		});
		webSocketContract.on('GameStarted', (gameId, player1, betAmount) => {
			console.log("BoardGameStarted")
			setPlayer1Play(true)
		});
		webSocketContract.on('MadeMove', (gameId,x,y, player) => {
			console.log("BoardMadeMove")
			console.log(`MadeMove of gameID ${gameId} of x:${x} and y:${y} `)
			
		});
		webSocketContract.on('HaveWinner', (gameId, winner, reward) => {
			console.log("BoardHaveWinner")
			
		});
		webSocketContract.on('GameCancelled',(gameId,player1)=>{
			console.log("BoardGameCancelled")
		});
				



	},[])


	const makeMove = async (x,y) => {
		console.log(x,y)
		if (contract) {
			try {
				const overrides = {
					value: '10000'
					};

				webSocketContract.on('MadeMove', (gameId,x,y, player) => {
					console.log("BoardMadeMove")
					console.log(`MadeMove of gameID ${gameId} of x:${x} and y:${y} `)
					
				});
				const transaction = await contract.makeMove(x,y,gameId, overrides);
			 
				const receipt = await provider.waitForTransaction(transaction.hash);
				console.log(receipt)
				if (receipt.status === 1) {
					
				}
			} catch (error) {
				console.error("Failed to make move:", error);
			}
		}
	};

	const handleClick = (i) => {
		console.log(i)
		const newSquares = squares.slice();
		if (calculateWinner(newSquares) || newSquares[i]) {
			return;
		}
		newSquares[i] = isXNext ? "X" : "O";
		makeMove(Math.ceil(i/3),i%3)
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
					{status}
				</div>
			</div>
		</div>
	);
}

// Add the calculateWinner function here...

export default Board;
