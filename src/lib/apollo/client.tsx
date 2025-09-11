// lib/apollo/client.ts
"use client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider,
} from "@apollo/client-integration-nextjs";
import { HttpLink } from "@apollo/client";

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
        "http://localhost:3001/graphql",
      fetchOptions: { cache: "no-store" },
    }),
  });
}

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
