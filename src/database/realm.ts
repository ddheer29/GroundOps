import { createRealmContext } from '@realm/react';
import { Task, User, SyncQueue } from './schemas';

export const RealmContext = createRealmContext({
  schema: [Task, User, SyncQueue],
  schemaVersion: 1,
});

export const { RealmProvider, useRealm, useQuery, useObject } = RealmContext;
