export const ADD_USER = `
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      message
      status
    }
  }
`;

export const LOGIN_USER = `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      userId
    }
  }
`;

export const LOGOUT_USER = `
  mutation logout {
    logout {
      message
      status
    }
  }
`;
