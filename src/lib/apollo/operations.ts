// src/lib/apollo/operations.ts
import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String) {
    register(email: $email, password: $password, name: $name) {
      user {
        id
        email
        name
      }
      message
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        name
      }
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout
  }
`;
