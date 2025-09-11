// lib/apollo/server.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/client-integration-nextjs";

function makeServerClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.GRAPHQL_ENDPOINT!,
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}

export const { getClient, query, PreloadQuery } =
  registerApolloClient(makeServerClient);
