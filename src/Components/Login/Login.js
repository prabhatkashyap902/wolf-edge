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
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      alert("MetaMask is not installed! Please install it using chrome extension to continue.");
    }
  };

  const signMessage = async () => {
    if (account) {
      try {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const message = "Please sign this message to prove you own the connected Ethereum address.";
        const signature = await signer.signMessage(message);
        console.log("Signature:", signature);
        localStorage.setItem(isLoggedIn,true)
        toast("You are redirecting to home!");
        setTimeout(()=>{
          navigate('/')
        }, 3000);
        
      } catch (error) {
        console.error("Failed to sign message", error);
      }
    } else {
      alert("Please connect your wallet first!");
    }
  };
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
         {!account && <button className='bg-blue-500 text-white px-4 py-2 rounded-lg' onClick={connectWallet} >
         Connect Your MetaMask Wallet
      </button>}
      {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` :""}
      {account && <button className='bg-blue-500 text-white px-4 py-2 rounded-lg'   onClick={signMessage}>Accept Signature request</button>}
      <ToastContainer />
    </div>
  )
}

export default Login