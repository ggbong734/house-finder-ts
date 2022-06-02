import { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo";
import { AuthProvider } from "src/auth/useAuth";
import "../styles/index.css";

// a component in next js that can wrap itself around every other page
// component is received as a prop and returned represents each page basically
// like react router
// we would want providers, things that are providing to every page of our application like apollo and auth provider
//we also want our apollo client on every page so we can include the apollo provider here.
// so we can execute apollo graphql query

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo();
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Head>
          <title>Home Sweet Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  );
}
