import { GraphQLError } from "graphql";

export class AppGraphQLError extends GraphQLError {
  constructor(message: string, code: string, extensions?: Record<string, any>) {
    super(message, {
      extensions: {
        code, // custom error code
        ...extensions,
      },
    });
  }
}
