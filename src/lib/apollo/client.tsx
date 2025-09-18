// lib/apollo/client.ts
"use client";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";

export function makeClient() {
  return new ApolloClient({
    // If you want to avoid SSR cache sharing issues in Next App Router:
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
        "http://localhost:3001/graphql",
      fetchOptions: { cache: "no-store" },
      credentials: "include",
    }),
  });
}

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = React.useMemo(() => makeClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
