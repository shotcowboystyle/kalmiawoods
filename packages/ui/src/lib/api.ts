import Cookies from 'js-cookie';

// const GRAPHQL_URL = import.meta.env.PUBLIC_GRAPHQL_URL;
const GRAPHQL_URL = 'http://localhost:4000/graphql';

export const fetchAPI = async (query: string, { variables }: { variables?: Object } = {}, authToken?: string) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(authToken != null && { Authorization: `Bearer ${authToken}` }),
  };

  // const res = await (
  //   await fetch(GRAPHQL_URL, {
  //     method: 'POST',
  //     headers,
  //     body: JSON.stringify({ query, variables }),
  //   })
  // ).json();

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    // ...(authToken != null && { credentials: 'include' }),
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 200) {
    console.log('BOOYAKASHA');
    const refreshToken = res.headers.get('Set-Cookie');
    if (refreshToken) {
      console.log('REFRESH TOKEN', refreshToken);
      Cookies.set(refreshToken);
    }
  }
  console.log('RESPONSE', res);
  const { data } = await res.json();

  if (data.errors) {
    console.error(data.errors);
    throw new Error('Failed to fetch API');
  }

  return data;
};
