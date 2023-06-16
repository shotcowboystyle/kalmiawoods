import { map } from 'nanostores';
import type { NavItem } from '../navigation';

export type SessionProps = {
  sentinelHeader: boolean;
  // stateNavApp: NavItem | null;
};

const initSession: SessionProps = {
  sentinelHeader: true,
  // stateNavApp: null,
};

export const session = map(initSession);
