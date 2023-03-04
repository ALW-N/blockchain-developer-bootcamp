import { useEffect } from 'react';
import config from '../config.json';
import { useDispatch } from 'react-redux';
import { loadProvider, loadNetwork, loadAccount, loadTokens, loadExchange, subscribeToEvents } from '../store/interactions';

import Navbar from './Navbar.js';
import Markets from './Markets.js';
import Balance from "./Balance.js";
import Order from "./Order.js";

function App() {
  const dispatch = useDispatch();
  const loadBlockchainData = async () => {
    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch)

    //Fetch curretn network chainId(e.g. hardhat: 31337)
    const chainId = await loadNetwork(provider, dispatch)

    //Reload Page When Network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    //Fetch current account and balance from Metamask
    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch)
    })

    // Load token Smart Contracts
    const EDGE = config[chainId].EDGE;
    const mETH = config[chainId].mETH;
    await loadTokens(provider, [EDGE.address, mETH.address], dispatch)

    //Load exchange smart contracts
    const exchangeConfig = config[chainId].exchange
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch)

    //Listen to events
    subscribeToEvents(exchange, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <div>

      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
