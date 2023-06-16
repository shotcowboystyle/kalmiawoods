const GRAPHQL_URL = import.meta.env.PUBLIC_GRAPHQL_URL;

export const fetchAPI = async (
  query: string,
  { variables }: { variables?: Object } = {},
  authToken?: string,
) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(authToken != null && { Authorization: `Bearer ${authToken}` }),
  };

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    // ...(authToken != null && { credentials: 'include' }),
    body: JSON.stringify({ query, variables }),
  });

  const { data } = await res.json();

  if (data?.errors) {
    console.error(data.errors);
    throw new Error('Failed to fetch API');
  }

  return data;
};
