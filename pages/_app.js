import { SessionProvider } from "next-auth/react";
import React from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../src/aws-exports";
import "../styles/globals.css";

Amplify.configure({ ...config, ssr: true });

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
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <button onClick={signOut}>Sign out</button>
    </SessionProvider>
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
