import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";
// import { CreatePostView } from "../views";
import { Create } from '../components/Create'

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      {/* <HomeView /> */}
      {/* <CreatePostView /> */}
      <Create />
    </div>
  );
};

export default Home;
