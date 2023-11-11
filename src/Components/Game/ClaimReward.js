import React from 'react'
import { Blocks, Oval } from 'react-loader-spinner';

const ClaimReward = ({click,setclaimRewardsClick,claimRewardsClick,number_of_clicks}) => {
  return (
	<div><div><p>You are the winner</p>{number_of_clicks!=2?<button className='bg-blue-500 text-white px-4 py-2 rounded-lg'onClick={click} >
		{claimRewardsClick?<Oval
								ariaLabel="loading-indicator"
								height={25}
								width={25}
								strokeWidth={5}
								strokeWidthSecondary={1}
								color="blue"
								secondaryColor="white"
								/>:'Claim Rewards!'}</button>:<p>Close the tab now!</p>} </div></div>
  )
}

export default ClaimReward