import { Contract, ethers, formatUnits } from "ethers";
import './App.css'
import { useEffect, useState } from "react";

const ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_workIndex",
        "type": "uint256"
      }
    ],
    "name": "completeWork",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_freelancer",
        "type": "address"
      }
    ],
    "name": "depositFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "workIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "workIndex",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "freelancer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_workIndex",
        "type": "uint256"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "workIndex",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "freelancer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WorkCompleted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "workIndex",
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
    "name": "works",
    "outputs": [
      {
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "freelancer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "completed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

function App() {
  const [provider , setProvider] = useState();
  const [signer , setSigner] =  useState();
  const [contract, setContract] = useState();
  const [workIndex, setWorkIndex] = useState();
  const [freelancer, setFreeLancer] = useState();
  const [amount , setAmount] = useState();

  useEffect(() => {
    const ethProvider = new ethers.BrowserProvider(window.ethereum)
    setProvider(ethProvider);
  }, []);// gets the provider for blockchain of the metamask

  const getSigner = async () => {
    const signer = await provider.getSigner()
    const contractt = new Contract("0x62893e62d4b858C111748dCEA90FE7eb495bF2bC", ABI, signer);
    setSigner(signer);
    setContract(contractt);
  }// gets the signer and connects the signer to blockchain

  const getCurrentWorkByIndex = async (index) => {
    var index = await contract.works(index);
    console.log(index);
  }// gets the work of a index

  const assignFreeLancer = async (address, Amount) => {
    const response = await contract.depositFunds(address,{
      value : Amount
    })
    const receipt = await response.wait()
    console.log(receipt);
    console.log(receipt.logs)
  }// assigns a freelancer

  return (
    <div>
    {
      signer ?
      <>
      <div style={{margin : "1rem"}}>
        Hello - {signer.address}
      </div>
      <div style={{display : "flex" , columnGap : "1rem" , alignItems : "center", justifyContent : "center"}}>
        <div>
          <input type="number" placeholder="workIndex" value={workIndex} onChange={(e) => {setWorkIndex(e.target.value)}}/>
        </div>
        <div>
          <button onClick={async () => {
            await getCurrentWorkByIndex(workIndex);
            }}>
            get Work
          </button>
        </div>
      </div>
      <div style={{display : "flex" , columnGap : "1rem" , alignItems : "center", justifyContent : "center"}}>
        <div>
          <input placeholder="Free-Lancer Address" value={freelancer} onChange={(e) => {setFreeLancer(e.target.value)}}/>
        </div>
        <div>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => {setAmount(+e.target.value)}}/>
        </div>
        <div>
          <button onClick={async () => {
            await assignFreeLancer(freelancer , amount);
            }}>
            Assign FreeLancer
          </button>
        </div>
      </div>
      </>
      :
      <button onClick={async () => {
        getSigner()
      }}>
        Sign In
      </button>
    }
  </div>
  )
}

export default App
