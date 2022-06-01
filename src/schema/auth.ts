import { AuthChecker } from "type-graphql";
import { Context } from "./context";

// where we will build all the graphQL functionality: resolvers, mutations, queries,
export const authChecker: AuthChecker<Context> = ({ context }) => {
  const { uid } = context;
  return !!uid;
};
