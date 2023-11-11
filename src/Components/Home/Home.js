import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from "ethers";
import { GoDotFill } from 'react-icons/go';
import {  Web3Provider, WebSocketProvider } from '@ethersproject/providers';
import { contarctABI, metamaskId } from '../Utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { setContracts, setPlayer1Address, setPlayer2Address, setProviders, setSigners, setWebSocketContracts } from '../Redux/DataSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Board from '../Game/Board';
import { Blocks, Oval } from 'react-loader-spinner';

const Home = () => {
	// const ethers = require("ethers")
	const navigate=useNavigate()
	const[balance,setBalance]=useState(null)
	const dispatch = useDispatch(); 
	
	const player1Address=useSelector((state)=>state.data.player1Address)
	const player2Address=useSelector((state)=>state.data.player2Address)

  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const [webSocketContract, setWebSocketContract] = useState(null);
	const[submitJoin, setSubmitJoin]=useState(false)
	const[createGame,setCreateGame]=useState(false)
  
	const[gameOn,setGameOn]=useState(false)
	const[gameId,setGameId]=useState(0)
	const[player,setPlayer]=useState(0)
	const[comingFrom,setComingFrom]=useState("noo")
	const[player2Joined,setPlayer2Joined]=useState(false)
	const handleLogout=()=>{
		localStorage.clear()	
		navigate('/login')
	}
	async function getPlayerOneAddress(gameId) {
		const game = await contract.games(gameId);
		return game.playerOne;
	  }

	const showError = () => toast("Something went Wrong!");
	useEffect(() => {
		const handleBeforeUnload = (e) => {
		  // Cancel the event as stated by the standard.
		  e.preventDefault();
		  // Chrome requires returnValue to be set.
		  e.returnValue = '';
		};
	
		window.addEventListener('beforeunload', handleBeforeUnload);
	
		return () => {
		  window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	  }, []);
	
	useEffect(() => {
		console.log(player1Address)
		console.log(player2Address)
		changeMainNetToSepoliaNet().then( async()=>{

						
			const provider = new Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			const contract = new ethers.Contract("0xaE4A69B66F131a4E86Da78F83f32c66E75CE329b", contarctABI, signer);

			const infuraWss = `wss://sepolia.infura.io/ws/v3/79a999fa3be34292b5d14e4c07aa2228`;
			const websocketProvider = new WebSocketProvider(infuraWss);
			const webSocketContract = new ethers.Contract("0xaE4A69B66F131a4E86Da78F83f32c66E75CE329b", contarctABI, websocketProvider.getSigner());

			setProvider(provider);
			dispatch(setProviders(provider))
			setSigner(signer);
			dispatch(setSigners(signer))
			setContract(contract);
			dispatch(setContracts(contract));
			setWebSocketContract(webSocketContract)
			dispatch(setWebSocketContracts(webSocketContract))
			webSocketContract.on('JoinedGame', (gameId, player) => {
				console.log(`Player ${player} joined game ${gameId}`);
				setPlayer2Joined(true);
			
			});
			webSocketContract.on('GameStarted', (gameId, player, betAmount) => {
				setGameId(gameId)
			  });
						
		})
		
	}, [player1Address,player2Address]);
	const JoinGameOnUI=async()=>{
		setCreateGame(true)
		setSubmitJoin(true)
		if(gameId===0){alert('Enter some value!'); setSubmitJoin(false)}
		if(contract){
			console.log(gameId)
			try{
				const overrides = {
					value: '10000'
					};
					
				webSocketContract.on('JoinedGame', async(gameId, player) => {
					console.log(`Player ${player} joined game ${gameId}`);
					const playerOneAddress = await getPlayerOneAddress(gameId);
					dispatch(setPlayer1Address(playerOneAddress))
					setCreateGame(false)
					setSubmitJoin(false)
					dispatch(setPlayer2Address(player))
					setPlayer2Joined(true)
					setGameOn(true);
					setComingFrom("join");
					setPlayer(2);
					// console.log()
				});

				const transaction = await contract.joinGame(gameId,overrides);
				
				// Wait for the transaction to be mined and confirmed
				const receipt = await provider.waitForTransaction(transaction.hash);
				
			}
			catch(error){
				console.log(error)
				setCreateGame(false)
				setSubmitJoin(false)
			}
		}
	}


		const startGameOnUI = async () => {
			// console.log(contract)
			setCreateGame(true)
			setSubmitJoin(true)
			if (contract) {
				try {
					

					 
					const overrides = {
					value: '10000'
					};
					
					 webSocketContract.on('GameStarted', (gameId, player, betAmount) => {
						console.log(`Game started: Game ID: ${gameId}, Player: ${player}, Bet Amount: ${betAmount}`);
						setGameId(gameId)
						setGameOn(true);
						setComingFrom("start");
						setPlayer(1);
						dispatch(setPlayer1Address(player))
						setCreateGame(false)
						setSubmitJoin(false)
					  });
					  
					const transaction = await contract.startGame(overrides);
					const transactionHash = transaction.hash;
					// setGameOn(true)
					
					const receipt = await provider.waitForTransaction(transactionHash, 1, 150000);	
					
					console.log( receipt);
					//  Transaction details
					console.log('Transaction hash:', receipt.transactionHash);
					console.log('Block hash:', receipt.blockHash);
					console.log('Block number:', receipt.blockNumber);
					console.log('Gas used:', receipt.gasUsed.toString());
					console.log("Game started!");
					
				} catch (error) {
					console.error("Failed to start game:", error);
					setCreateGame(false)
					setSubmitJoin(false)
					showError()
				}
			}
		};

		const changeMainNetToSepoliaNet=async()=>{
			const ethereum = window.ethereum;
			const chainId = await window.ethereum.request({ method: 'eth_chainId' });
			// console.log(chainId)
			if (chainId !== '0xaa36a7'){
			try {
				await ethereum.request({
				  method: 'wallet_switchEthereumChain',
				  params: [{ chainId: '0xaa36a7' }], // 0xa8d9c is the chainId for Sepolia testnet in hexadecimal
				});
			  } catch (switchError) {
				// This error code indicates that the chain has not been added to MetaMask
				// In this case, you can ask the user to add it manually.
				if (switchError.code === 4902) {
				  try {
					await ethereum.request({
					  method: 'wallet_addEthereumChain',
					  params: [
						{
						  chainId: '0xAA36A7', // A 0x-prefixed hexadecimal string
						  chainName: 'Sepolia Testnet',
						  nativeCurrency: {
							name: 'Sepolia Ether',
							symbol: 'SEP', // 2-6 characters long
							decimals: 18,
						  },
						  rpcUrls: ['wss://ethereum-sepolia.publicnode.com'],
						  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
						},
					  ],
					});
				  } catch (addError) {
					console.error('Error adding Sepolia testnet:', addError);
				  }
				}
				console.error('Error switching to Sepolia testnet:', switchError);
			  }
			}
				  
		}

		
		return (
			
		<div className='h-screen  flex flex-col'>
			{/**Header */}
			<div className='flex justify-between  h-12 text-center bg-blue-500 shadow-xl border text-white rounded-sm'>
					<div className='flex items-center justify-center mx-10 font-bold text-2xl '>Wolf Edge</div>
					<div className='flex items-center justify-center mx-4'>
 						<ul className='flex justify-between '>
							<li className='flex items-center justify-center mx-4  cursor-pointer font-semibold' onClick={handleLogout}>Logout</li>
						</ul>
					</div>
			</div>
			{/**Body */}

			{!gameOn?(<div className='flex-1 flex items-center justify-center'>
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="dark"
				/>
				<div className='rounded-lg shadow-xl p-4 flex flex-col'>
					<GoDotFill color="#00FF00" className='flex justify-end items-end'/>
					<div className='item-center justify-center flex'>You are Active</div>
					<div className='hover:'>Your MetaMask Account id- {localStorage.getItem('metamaskId').substring(0, 6)}...{localStorage.getItem('metamaskId').substring(localStorage.getItem('metamaskId').length - 4)}</div>
					<div className='flex justify-around'>
						<div className='flex justify-center text-center'>Join a Game:</div>
						<input type='number' placeholder="Enter Game Id..." className='text-black px-2 border-gray-500 border rounded-xl' onChange={e=>setGameId(e.target.value)}></input>
					
						<button className=	{`item-center justify-center flex  bg-blue-500 text-white m-2 px-2 py-1 rounded-md cursor-pointer ${submitJoin&& ' cursor-not-allowed'}`} onClick={JoinGameOnUI} disabled={submitJoin}>
							{submitJoin?<Oval
								ariaLabel="loading-indicator"
								height={25}
								width={25}
								strokeWidth={5}
								strokeWidthSecondary={1}
								color="blue"
								secondaryColor="white"
								/>:"Submit"}
						</button>
					</div>
					<div className='justify-center text-center'>OR</div>
					<button className={`item-center justify-center flex  bg-blue-500 text-white m-2 p-2 rounded-xl cursor-pointer font-bold text-lg ${createGame&& ' cursor-not-allowed'}`} onClick={startGameOnUI} disabled={createGame}>
						{createGame?<><Oval
							ariaLabel="loading-indicator"
							height={25}
							width={25}
							strokeWidth={5}
							strokeWidthSecondary={1}
							color="blue"
							secondaryColor="white"
							/></>:`Start new TicTacToe Game`}
					</button>
				</div>
				</div>)
				:
				(<div className='flex justify-center'><Board gameId={gameId}  player={player} comingFrom={comingFrom} player2Joined={player2Joined}/></div>)
				
			}
		</div>
	)
}

export default Home