import React, { useState } from 'react';
import { JsonRpcProvider, Contract, formatEther, formatUnits } from 'ethers';

const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/a489ab433866458a90d67b45d446a2b7');

const Contract_ADDRESS = '0xe5a6739b21fe84847dade7152ae6c68895dfdb38';
const ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export default function BalanceChecker() {
  const [address, setAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(null);
  const [rbalBalance, setRbalBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      setEthBalance(null);
      setRbalBalance(null);

      const ethRaw = await provider.getBalance(address);
      const eth = formatEther(ethRaw);

      const contract = new Contract(Contract_ADDRESS, ABI, provider);
      const rbalRaw = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const rbal = formatUnits(rbalRaw, decimals);

      setEthBalance(eth);
      setRbalBalance(rbal);
    } catch (err) {
      setEthBalance('Error');
      setRbalBalance('Error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/10">
        <h1 className="text-3xl font-extrabold text-center text-white tracking-widest mb-8 uppercase drop-shadow-md">
          🚀 Zeru Project
        </h1>

        <label className="block text-white text-sm mb-2 tracking-wide">
          Wallet Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0xABC123..."
          className="w-full rounded-xl px-4 py-3 bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        />

        <button
          onClick={fetchBalances}
          disabled={loading || address.length === 0}
          className={`mt-6 w-full py-3 rounded-xl text-white font-bold text-lg tracking-wider transition-all duration-300 ${
            loading
              ? 'bg-cyan-400/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 hover:from-cyan-500 hover:to-purple-600'
          }`}
        >
          {loading ? 'Fetching...' : 'Check Balances'}
        </button>

        {(ethBalance || rbalBalance) && (
          <div className="mt-8 space-y-4 text-center text-white">
            {ethBalance && (
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md">
                <p className="text-sm text-gray-300">ETH Balance</p>
                <p className="text-2xl font-semibold">{ethBalance} ETH</p>
              </div>
            )}
            {rbalBalance && (
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 shadow-md">
                <p className="text-sm text-gray-300">RBAL Balance</p>
                <p className="text-2xl font-semibold">{rbalBalance} RBAL</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
