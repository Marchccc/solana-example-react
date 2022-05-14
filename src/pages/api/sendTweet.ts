import * as anchor from '@project-serum/anchor';
import {
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token"; // IGNORE THESE ERRORS IF ANY
const { PublicKey, SystemProgram } = anchor.web3;

export const sendTweet = async (wallet, program, programId, connection, sendTransaction) => {

  const TOKEN_METADATA_PROGRAM_ID = programId;
  // // 返回账号租用豁免所需的最小余额。
  const lamports: number =
    await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
  const getMetadata = async (
    mint: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };
  const getMasterEdition = async (
    mint: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate(); // 生成一个新的随机密钥对
  const NftTokenAccount = await getAssociatedTokenAddress( // 获取给定铸币厂和所有者的关联令牌帐户的地址
    mintKey.publicKey, // 代币铸造账户
    program.provider.wallet.publicKey // 新帐户的所有者
  );
  
  console.log("NFT Account: ", NftTokenAccount.toBase58());
  
  const mint_tx = new anchor.web3.Transaction().add(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: program.provider.wallet.publicKey,
      newAccountPubkey: mintKey.publicKey,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
      lamports,
    }),
    createInitializeMintInstruction(
      mintKey.publicKey,
      0,
      program.provider.wallet.publicKey,
      program.provider.wallet.publicKey
    ),
    createAssociatedTokenAccountInstruction(
      program.provider.wallet.publicKey,
      NftTokenAccount,
      program.provider.wallet.publicKey,
      mintKey.publicKey
    )
  );
  const res = await sendTransaction(mint_tx, connection, {signers: [mintKey]});
  console.log(
    await program.provider.connection.getParsedAccountInfo(mintKey.publicKey)
  );

  console.log("Account: ", res);
  console.log("Mint key: ", mintKey.publicKey.toString());
  console.log("User: ", program.provider.wallet.publicKey.toString());

  const metadataAddress = await getMetadata(mintKey.publicKey);
  const masterEdition = await getMasterEdition(mintKey.publicKey);

  console.log("Metadata address: ", metadataAddress.toBase58());
  console.log("MasterEdition: ", masterEdition.toBase58());
  console.log(program);
  console.log(program.rpc);

  // AnchorError occurred. Error Code: InstructionFallbackNotFound. 
  // Error Number: 101. Error Message: Fallback functions are not supported.
  // mintNft
  const tx = await program.rpc.mintNft(
    mintKey.publicKey,
    "https://arweave.net/y5e5DJsiwH0s_ayfMwYk-SnrZtVZzHLQDSTZ5dNRUHA",
    "NFT Title",
    {
      accounts: {
        mintAuthority: program.provider.wallet.publicKey,
        mint: mintKey.publicKey,
        tokenAccount: NftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        metadata: metadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        payer: program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        masterEdition: masterEdition,
      },
    }
  );
  console.log(tx);
}
