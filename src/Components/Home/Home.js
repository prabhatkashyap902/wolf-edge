import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoDotFill } from 'react-icons/go';
import { Web3Provider } from '@ethersproject/providers';
import { contarctABI, metamaskId } from '../Utils/Utils';
import Board from '../Game/Board';
import { useDispatch, useSelector } from 'react-redux';
import { setContracts } from '../Redux/DataSlice';
import { generateRandomNumber } from '../Utils/Random';

const Home = () => {
	const ethers = require("ethers")
	const navigate=useNavigate()
	const[balance,setBalance]=useState(null)
	const dispatch = useDispatch(); 

  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
	const[gameOn,setGameOn]=useState(false)
	const[generateRandom, setGenerateRandom]=useState(null)

	const handleLogout=()=>{
		localStorage.clear()	
		navigate('/login')
	}
	
		useEffect(() => {




			changeMainNetToSepoliaNet().then(()=>{
				const providers = new Web3Provider(window.ethereum);
				const signers = providers.getSigner();
				setProvider(providers);
				setSigner(signers);
				const contracts = new ethers.Contract("0x2d7A6432eC7a07888bdC4dCEF0c7B4268eB6433E", contarctABI, signers);
				setContract(contracts);
				setGenerateRandom(generateRandomNumber())
				dispatch(setContracts(contracts));
				console.log(contracts)})
			// const providers = new Web3Provider(window.ethereum);
			// const signers = providers.getSigner();
            // setProvider(providers);
            // setSigner(signers);
			// const contracts = new ethers.Contract("0x2d7A6432eC7a07888bdC4dCEF0c7B4268eB6433E", contarctABI, signers);
			// setContract(contracts);
			// setGenerateRandom(generateRandomNumber())
			// dispatch(setContracts(contracts));
			// console.log(contracts)
			
		}, []);


		const startGame = async () => {
			console.log(contract)
			if (contract) {
				try {
					const transaction = await contract.startGame();
					setGameOn(true)
					await transaction.wait();
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
						  rpcUrls: ['https://rpc.sepolia.org/'],
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
					<div className='item-center justify-center flex  bg-blue-500 text-white m-2 p-2 rounded-xl cursor-pointer font-bold text-lg' onClick={startGame}>Play TicTacToe Game</div>
				</div>
				</div>)
				:
				<div className='flex-1 flex items-center justify-center'>

					<Board gameId={generateRandom}/>
				</div>
			}
		</div>
	)
}

export default Home