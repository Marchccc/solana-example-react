
import { FC, useEffect } from "react";
import { Create } from '../../components/Create';
// import { Provider, Program } from '@project-serum/anchor'
import idl from  '../../../solana_aoi.json';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const CreatePostView2: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore()
  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])
  console.log('sol:', balance);

  // // Address of the deployed program.
  // anchor.setProvider(anchor.AnchorProvider.local('http://127.0.0.1:8899'));
  // const programId = new anchor.web3.PublicKey(idl.metadata.address);
  // // Generate the program client from IDL.
  // const program = new anchor.Program(JSON.parse(JSON.stringify(idl)), programId);
  // console.log(programId);
  // console.log(program);

  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
        createPost
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="p-2 text-center">
          <Create />
          {/* <SendTransaction /> */}
          {/* {<p>&lt; your content &gt;</p>} */}
        </div>
      </div>
    </div>
  );
};
