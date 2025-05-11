import React, { useEffect, useState, useRef } from 'react';
import Modal from './Modal';

import SFLogo from '@assets/sf_logo.png';
import SFToken from '@assets/sf_token.png';
import bitsIcon from '@assets/bits_icon.png';

import Toast from '@components/Toast/Index';

const ITEMS = {
  'Heart': { id: 5, cost: 3, random: 1 },
  'Fazoli\'s': { id: 4, cost: 2 },
  'Star': { id: 6, cost: 2 },
  'Beam Sword': { id: 7, cost: 2 },
  'Bat': { id: 8, cost: 2 },
  'Fan': { id: 9, cost: 1 },
  'Wand': { id: 10, cost: 2 },
  'Ray Gun': { id: 11, cost: 2 },
  'Fire Flower': { id: 12, cost: 1 },
  'Hammer': { id: 13, cost: 3 },
  'Motion Sensor Bomb': { id: 14, cost: 2 },
  'Bob-omb': { id: 15, cost: 2 },
  'Bumper': { id: 16, cost: 1 },
  'Green Shell': { id: 17, cost: 1 },
  'Red Shell': { id: 18, cost: 2 },
  'Live Onyx': { id: 32, cost: 2 },
  'Live Snorlax': { id: 33, cost: 3 },
  'Blue Shell': { id: 48, cost: 3 },
  'Franklin Badge': { id: 51, cost: 2 },
  'Golden Gun': { id: 53, cost: 3 }
};

const getTokenAmount = (sku) => {
  // Extract the number from the SKU (e.g., "sf_token_5" => 5)
  const match = sku.match(/sf_token_(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
};

const sortedProducts = (products) => {
  return [...products].sort((a, b) => {
    return getTokenAmount(a.sku) - getTokenAmount(b.sku);
  });
}

const App = () => {
  const [xValue, setXValue] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [fetchingTokens, setFetchingTokens] = useState(false);
  const auth = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const fetchWrapper = async (endpoint, options = {}) => {
    const baseUrl = process.env.API_URL;
    const defaultHeaders = {
      'X-Auth-Source': 'extension',
      'Authorization': `Bearer ${auth.current.token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    });

    return response.json();
  };

  const fetchAndSetTokens = async () => {
    const tokens = await fetchWrapper(`/tokens?streamerId=${auth.current.channelId}`);
    setTokens(tokens);
  }

  useEffect(() => {
    if (!window.Twitch || !window.Twitch.ext) {   
      return;
    }

    window.Twitch.ext.bits.onTransactionComplete(transaction => {
      setFetchingTokens(true);
    });

    window.Twitch.ext.onAuthorized(async (_auth) => {
      auth.current = _auth;
      setIsLoading(false);
      fetchAndSetTokens();
    });

    if (!products) {
      try {
        window.Twitch.ext.bits.getProducts().then((products) => {
          setProducts(products);
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

  }, []);

  const openPurchaseModal = async (sku) => {
    setPurchaseModalOpen(true);
  };

  const purchaseProduct = async (sku) => {
    window.Twitch.ext.bits.useBits(sku);
  };

  const spawnItem = async (id) => {
    const [itemName, item] = Object.entries(ITEMS).find(([_, item]) => item.id === id);
    try {
      await fetchWrapper(`/redeem`, {
        method: 'POST',
        body: JSON.stringify({
          tokenIds: tokens.slice(0, item.cost).map(token => token._id),
          itemId: item.id,
          streamerId: auth.current.channelId,
          xCoord: xValue
        })
      });

      fetchAndSetTokens();
      setToastMessage(`${itemName} spawned!`);
      setToastOpen(true);
    } catch (error) {
      console.error("Error spawning item:", error);
    }
  };

  const renderProducts = () => {
    return sortedProducts(products).map((product) => (
      <div key={product.sku} className="flex mb-2">
        <div className="flex items-center">
          <div className="relative flex-1">
            <img
              src={SFToken}
              alt="Smash Factory Token"
              className="token-icon mr-2"
            />
            <div className="token-cost">
              {getTokenAmount(product.sku)}x
            </div>
          </div>
          <div className="w-[30px] flex justify-center flex-1">
            =
          </div>
          <div className="w-full flex justify-end flex-1">
            <div className="relative">
              <img
                src={bitsIcon}
                alt="Bits Icon"
                className="bits-icon w-1/2 ml-2"
              />
              <div className="token-cost">
                {product.cost.amount}x
              </div>
            </div>
          </div>
        </div>
        <button className="purchase-button ml-2" onClick={() => purchaseProduct(product.sku)}>
          Buy
        </button>
      </div>
    ))
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-blue-700 text-white p-6 rounded shadow text-lg font-bold animate-pulse">
          Getting your account Info From Twitch...
        </div>
      </div>
    );
  }

  return (
    <div className="twitch-panel">
      <img src={SFLogo} alt="Smash Factory Logo" className="w-1/2 mx-auto mb-4" />

      <div className="mb-6">
        <label htmlFor="xSlider" className="text-ssb-blue font-bold">
          X Position: {xValue}
        </label>
        <input
          type="range"
          id="xSlider"
          min="-8000"
          max="8000"
          value={xValue}
          onChange={(e) => setXValue(parseInt(e.target.value))}
          className="w-full h-2 bg-ssb-dark-blue rounded-lg appearance-none cursor-pointer accent-ssb-orange"
        />
        <div className="flex justify-between mt-1">
          <span className="text-white">-8000</span>
          <span className="text-white">0</span>
          <span className="text-white">8000</span>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <img src={SFToken} alt="Smash Factory Token" className="token-icon" />
          <div className="text-white text-xl font-bold">
            : {tokens.length}
          </div>
          <div className="ml-2 flex items-center cursor-pointer" onClick={fetchAndSetTokens}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
        </div>
        <div className="text-white">
          <button className="purchase-button" onClick={openPurchaseModal}>
            Purchase Tokens
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(ITEMS).map(([name, { cost, id }]) => (
          <button
            key={name}
            onClick={() => spawnItem(id)}
            className="flex flex-col items-center bg-ssb-dark-blue/80 rounded-lg p-4 shadow-md hover:bg-ssb-dark-blue/60 transition-colors w-36"
          >
            <img
              src={`./assets/item_icons/${id}.png`}
              alt={name}
              className="w-12 h-12 mb-2"
            />
            <span className="text-white font-semibold mb-1">{name}</span>
            <div className="flex items-center mt-1">
              <img src={SFToken} alt="Token" className="w-5 h-5 mr-1" />
              <span className="text-ssb-blue font-bold">{cost}x</span>
            </div>
          </button>
        ))}
      </div>
      <Modal isOpen={purchaseModalOpen} onClose={() => setPurchaseModalOpen(false)}>
        <div className="flex flex-col items-center justify-center">
          {(!fetchingTokens && products) &&
            renderProducts()
          }
          {fetchingTokens &&
            <div className="text-white">
              Tokens are being added!
            </div>
          }
        </div>
      </Modal>
      {toastOpen &&
        <Toast message={toastMessage} onClose={() => setToastOpen(false)} />
      }
    </div>
  );
};

export default App; 