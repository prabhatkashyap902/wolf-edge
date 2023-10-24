import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoDotFill } from 'react-icons/go';
import { SEPOLIABALANCE, metamaskId } from '../Utils/Utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { utils  } from 'ethers';

const Home = () => {

	const navigate=useNavigate()
	const[balance,setBalance]=useState(null)

	const handleLogout=()=>{
		localStorage.clear()	
		navigate('/login')
	}

	const getEthBalance = async (address) => {
		const provider = new  JsonRpcProvider(SEPOLIABALANCE+localStorage.getItem(metamaskId));
		const balance = await provider.getBalance(address);
		
		console.log(balance)
		return balance
	};

	useEffect(()=>{
			// Connect to the Sepolia testnet
			console.log(getEthBalance(localStorage.getItem(metamaskId)))

	},[])


	return (
		<div className='h-screen  flex flex-col'>
			{/**Header */}
			<div className='flex justify-between  h-12 text-center bg-blue-500 shadow-xl border text-white rounded-sm'>
					<div className='flex items-center justify-center mx-10 font-bold text-2xl '>Wolf Edge</div>
					<div className='flex items-center justify-center mx-4'>
 						<ul className='flex justify-between '>
							<li className='flex items-center justify-center mx-4 cursor-pointer font-semibold'> Invitations</li>
							<li className='flex items-center justify-center mx-4  cursor-pointer font-semibold' onClick={handleLogout}>Logout</li>
						</ul>
					</div>
			</div>
			{/**Body */}
			<div className='flex-1 flex items-center justify-center'>
			<div className='rounded-lg shadow-xl p-4 flex flex-col'>
				<GoDotFill color="#00FF00" className='flex justify-end items-end'/>
				<div className='item-center justify-center flex'>You are Active</div>
				<div className='hover:'>Your MetaMask Account id- {localStorage.getItem('metamaskId').substring(0, 6)}...{localStorage.getItem('metamaskId').substring(localStorage.getItem('metamaskId').length - 4)}</div>
				<div className='item-center justify-center flex  bg-blue-500 text-white m-2 p-2 rounded-xl cursor-pointer font-bold text-lg'>Play TicTacToe Game</div>
			</div>
			</div>
		</div>
	)
}

export default Home