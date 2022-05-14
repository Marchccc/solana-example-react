import type { NextPage } from "next";
import Head from "next/head";
import { CreatePostView } from "../views";

const createPost: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <CreatePostView />
    </div>
  );
};

export default createPost;
