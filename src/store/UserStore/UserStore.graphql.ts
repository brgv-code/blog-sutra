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

export const REQUEST_PASSWORD_RESET = gql`
  mutation REQUEST_PASSWORD_RESET($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;
