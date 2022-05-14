// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <>
      <div className="container mx-auto px-4 mt-16">
        <div className="text-left">
          {wallet.publicKey && <p className='font-bold'>Public Key（账号）: <span className='text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]'>{wallet.publicKey.toBase58()}</span></p>}
          {wallet.publicKey && <p className='font-bold'>SOL余额: <span className='text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]'>{(balance || 0).toLocaleString()}</span></p>}
        </div>
      </div>
    </>
  );
};
