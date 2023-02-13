import { ApolloClient, InMemoryCache } from "@apollo/client";

export const createClient = () => {
  const client = new ApolloClient({
    uri: "https://api.hashnode.com/",
    cache: new InMemoryCache(),
  });

  return client;
};
