import { SessionProvider } from "next-auth/react";
import React from "react";
import Layout from "../components/Layout.js";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsmobile from "../src/aws-exports";
import "../styles/globals.css";
import { SelectedEventProvider } from "../contexts/SelectedEventContext";
import Router from "next/router";
import Loader from "../components/Loader";
import { useState } from "react";

Amplify.configure({ ...awsmobile, ssr: true });

function MyApp({
  isPassedToWithAuthenticator,
  signOut,
  user,
  Component,
  pageProps: { session, ...pageProps },
}) {
  if (isPassedToWithAuthenticator) {
    throw new Error(`isPassedToWithAuthenticator was not provided`);
  }

  const [loading, setLoading] = useState(false);
  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
    document.body.style.overflow = "hidden";
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
    document.body.style.overflow = "auto";
  });

  return (
    <SelectedEventProvider>
      <Layout>
      {loading && <Loader />}
        <Component {...pageProps} />

      </Layout>
    </SelectedEventProvider>
  );
}

export default withAuthenticator(MyApp);

export async function getStaticProps() {
  return {
    props: {
      isPassedToWithAuthenticator: true,
    },
  };
}
