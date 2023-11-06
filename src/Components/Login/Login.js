import React, { useState } from 'react'
import { Web3Provider } from '@ethersproject/providers';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { isLoggedIn, metamaskId } from '../Utils/Utils';


const Login = () => {
	const [account, setAccount] = useState(null);
	const navigate =useNavigate()
 

	const connectWallet = async () => {
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				setAccount(accounts[0]);
				
				localStorage.setItem(metamaskId,accounts[0])
				localStorage.setItem(isLoggedIn,true)
				toast("You are redirecting to home!");
				setTimeout(()=>{
					navigate('/')
				}, 3000);
			} catch (error) {
				console.error("Failed to connect wallet", error);
			}
		} else {
			alert("MetaMask is not installed! Please install it using chrome extension to continue.");
		}
	};

	
	return (
		<div className='flex flex-col justify-center items-center h-screen'>
				 {!account && <button className='bg-blue-500 text-white px-4 py-2 rounded-lg' onClick={connectWallet} >
				 Connect Your MetaMask Wallet
			</button>}
			{account ? <p className='px-10 bg-blue-500 text-white rounded-md py-2'>Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}</p> :""}
			{/* {account && <button className='bg-blue-500 text-white px-4 py-2 rounded-lg'   onClick={signMessage}>Accept Signature request</button>} */}
			<ToastContainer />
		</div>
	)
}

export default Login