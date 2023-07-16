import { nanoquery } from '@nanostores/query';

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (...keys: string[]) => fetch(keys.join('')).then((res) => res.json()),
});

export const isReady = (fs) => {
  const { data, error, loading } = fs;
  return !loading && error === undefined && data !== undefined;
};
