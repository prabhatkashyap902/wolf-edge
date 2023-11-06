import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from "ethers";
import { GoDotFill } from 'react-icons/go';
import {  Web3Provider, WebSocketProvider } from '@ethersproject/providers';
import { contarctABI, metamaskId } from '../Utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { setContracts, setProviders, setSigners, setWebSocketContracts } from '../Redux/DataSlice';
import { current } from '@reduxjs/toolkit';
import Board from '../Game/Board';

const Home = () => {
	// const ethers = require("ethers")
	const navigate=useNavigate()
	const[balance,setBalance]=useState(null)
	const dispatch = useDispatch(); 

  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const [webSocketContract, setWebSocketContract] = useState(null);

  
	const[gameOn,setGameOn]=useState(false)
	const[gameId,setGameId]=useState(0)
	const[player,setPlayer]=useState(0)
	const[comingFrom,setComingFrom]=useState("noo")
	const[player2Joined,setPlayer2Joined]=useState(false)
	const handleLogout=()=>{
		localStorage.clear()	
		navigate('/login')
	}
	
	useEffect(() => {
		changeMainNetToSepoliaNet().then( async()=>{

						
			const provider = new Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			const contract = new ethers.Contract("0xae4a69b66f131a4e86da78f83f32c66e75ce329b", contarctABI, signer);

			const infuraWss = `wss://sepolia.infura.io/ws/v3/79a999fa3be34292b5d14e4c07aa2228`;
			const websocketProvider = new WebSocketProvider(infuraWss);
			const webSocketContract = new ethers.Contract("0xae4a69b66f131a4e86da78f83f32c66e75ce329b", contarctABI, websocketProvider.getSigner());

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
		
	}, []);
	const JoinGameOnUI=async()=>{
		if(contract){
			console.log(gameId)
			try{
				const overrides = {
					value: '10000'
					};
					
				webSocketContract.on('JoinedGame', (gameId, player) => {
					console.log(`Player ${player} joined game ${gameId}`);
					
					setPlayer2Joined(true)
				});

				const transaction = await contract.joinGame(gameId,overrides);
				
				// Wait for the transaction to be mined and confirmed
				const receipt = await provider.waitForTransaction(transaction.hash);
				console.log(receipt)
				if (receipt.status === 1) {
					setGameOn(true);
					setComingFrom("join");
					setPlayer(2);
				}
			}
			catch(error){
				console.log(error)
			}
		}
	}


		const startGameOnUI = async () => {
			// console.log(contract)
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
				}
			}
		};

		const changeMainNetToSepoliaNet=async()=>{
			const ethereum = window.ethereum;
			const chainId = await window.ethereum.request({ method: 'eth_chainId' });
			console.log(chainId)
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
				<div className='rounded-lg shadow-xl p-4 flex flex-col'>
					<GoDotFill color="#00FF00" className='flex justify-end items-end'/>
					<div className='item-center justify-center flex'>You are Active</div>
					<div className='hover:'>Your MetaMask Account id- {localStorage.getItem('metamaskId').substring(0, 6)}...{localStorage.getItem('metamaskId').substring(localStorage.getItem('metamaskId').length - 4)}</div>
					<div className=''>Join a Game:<input type='number' placeholder="Enter Game Id..." className='text-black px-2 border-gray-500 border' onChange={e=>setGameId(e.target.value)}></input>
					
					<div className='item-center justify-center flex  bg-blue-500 text-white m-2 p-2 rounded-xl cursor-pointer ' onClick={JoinGameOnUI}>Submit</div></div>
					<div className='justify-center text-center'>OR</div>
					<div className='item-center justify-center flex  bg-blue-500 text-white m-2 p-2 rounded-xl cursor-pointer font-bold text-lg' onClick={startGameOnUI}>Start new TicTacToe Game</div>
				</div>
				</div>)
				:
				(<div className='flex justify-center'><Board gameId={gameId}  player={player} comingFrom={comingFrom} player2Joined={player2Joined}/></div>)
				
			}
		</div>
	)
}

export default Home