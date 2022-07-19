import { SessionProvider } from "next-auth/react";
import React from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsmobile from "../src/aws-exports";
import "../styles/globals.css";

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
  return (
    <>
      <Component {...pageProps} />
      <button onClick={signOut}>Sign out</button>
    </>
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
