import React from 'react'

const ClaimReward = ({click}) => {
  return (
    <div><div><p>You are the winner</p><button className='bg-blue-500 text-white px-4 py-2 rounded-lg'onClick={click}>Claim Rewards!</button> </div></div>
  )
}

export default ClaimReward