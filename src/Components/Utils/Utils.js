const contarctABI=[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_commission",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_MINIMUM_ENTRY_FEE",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "playerOne",
				"type": "address"
			}
		],
		"name": "GameCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "playerOne",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "entryFee",
				"type": "uint256"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum TicTacToe.Winner",
				"name": "winner",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "HaveWinner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "playerTwo",
				"type": "address"
			}
		],
		"name": "JoinedGame",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "y",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "MadeMove",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "cancelGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "claimRewards",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "commission",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "countGame",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "games",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "gameId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "creatingTime",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "playerOne",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "playerTwo",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "rewardPool",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isStarted",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "nextMove",
				"type": "address"
			},
			{
				"internalType": "enum TicTacToe.Winner",
				"name": "winner",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getEachBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "getGameBoard",
		"outputs": [
			{
				"internalType": "enum TicTacToe.Status[3][3]",
				"name": "",
				"type": "uint8[3][3]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGames",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "gameId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "creatingTime",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "playerOne",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "playerTwo",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "rewardPool",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isStarted",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "nextMove",
						"type": "address"
					},
					{
						"internalType": "enum TicTacToe.Status[3][3]",
						"name": "gameBoard",
						"type": "uint8[3][3]"
					},
					{
						"internalType": "enum TicTacToe.Winner",
						"name": "winner",
						"type": "uint8"
					}
				],
				"internalType": "struct TicTacToe.Game[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "joinGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_x",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_y",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_gameId",
				"type": "uint256"
			}
		],
		"name": "makeMove",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pausedAllGames",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "toggleContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]