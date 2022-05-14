import * as anchor from '@project-serum/anchor';

export const sendTweet2 = async (wallet, program, topic, content) => {
    const tweet = anchor.web3.Keypair.generate();
    await program.rpc.sendTweet(topic, content, {
        accounts: {
            author: wallet.publicKey,
            tweet: tweet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [tweet]
    })

    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
    console.log("---");
    console.log(tweet.publicKey);
    console.log(tweetAccount);
    return tweetAccount;
    // return new Tweet(tweet.publicKey, tweetAccount)
}
