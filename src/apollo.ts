import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { useMemo } from "react";

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: "/api/graphql", credentials: "same-origin" }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}

export function useApollo() {
  // use Memo avoids calling create Client multiple times if it has been called before s
  const client = useMemo(() => createApolloClient(), []);
  return client;
}
