// TODO: SignMessage
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useCallback, useState } from 'react';
import { sign } from 'tweetnacl';
import { notify } from "../utils/notifications";
// import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../../metaplex_anchor_nft.json';
import * as anchor from '@project-serum/anchor';
import { Provider, Program, AnchorProvider } from '@project-serum/anchor';
import { sendTweet } from '../pages/api/sendTweet';
import { MetaplexAnchorNft } from "../../metaplex_anchor_nft";
import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
    MINT_SIZE,
  } from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
const { PublicKey, SystemProgram, Connection } = anchor.web3;

export const Create: FC = () => {
    const { connection } = useConnection();
    const { publicKey, signMessage } = useWallet();
    const wallet = useWallet();
    const { sendTransaction } = useWallet();
    const [topic, setTopic] = useState<string>("")
    const [content, setContent] = useState<string>("")

    const options = anchor.AnchorProvider.defaultOptions();
    const provider = new AnchorProvider(connection, wallet, options);
    anchor.setProvider(provider);
    const programId = new anchor.web3.PublicKey(idl.metadata.address);
    const program = new anchor.Program(JSON.parse(JSON.stringify(idl)), programId);

    const onClick = useCallback(async () => {
        try {

            // 如果钱包未连接，`publicKey` 将为空
            if (!publicKey) throw new Error('钱包未连接!');

            // 如果钱包不支持，`signMessage` 将是未定义的
            if (!signMessage) throw new Error('钱包不支持消息签名!');

            const tweet = await sendTweet(wallet, program, programId, connection, sendTransaction);

            notify({ type: 'success', message: '签名消息成功!', description: '信息已上链' });

        } catch (error: any) {
            notify({ type: 'error', message: `提示`, description: error?.message });
        }
    }, [publicKey, notify, signMessage, programId, connection, sendTweet, wallet, program, sendTransaction]);

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        setTopic(e.target.value);
    }
    const onChangeContent = (e: React.FormEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    }

    return signMessage ? (
        <div>
            {/* <input value={topic} onChange={onChange} type="text" placeholder="Topic" className="input input-bordered input-info w-full max-w-xs" />
            <br />
            <br />
            <textarea value={content} onChange={onChangeContent} className="textarea textarea-info" style={{ width: '100%' }} placeholder="Content"></textarea>
            <br />
            <br /> */}
            <button onClick={onClick} disabled={!publicKey} className="btn btn-block">test</button>
        </div>
    ) : null;
};
