import Realm, { BSON } from 'realm';

export class Task extends Realm.Object<Task> {
  _id!: string;
  title!: string;
  description!: string;
  location!: string;
  status!: string;
  priority!: string;
  notes?: string;
  updatedAt!: Date;
  isSynced!: boolean;
  attachments!: Realm.List<string>;

  static schema: Realm.ObjectSchema = {
    name: 'Task',
    properties: {
      _id: 'string', // Matching server ID type
      title: 'string',
      description: 'string',
      location: 'string',
      status: { type: 'string', default: 'Pending' }, // Pending, In Progress, Completed
      priority: { type: 'string', default: 'Normal' },
      notes: { type: 'string', optional: true },
      updatedAt: { type: 'date', default: () => new Date() },
      isSynced: { type: 'bool', default: false },
      attachments: 'string[]',
    },
    primaryKey: '_id',
  };
}

export class User extends Realm.Object<User> {
  _id!: BSON.ObjectId;
  username!: string;
  token!: string;
  sessionActive!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      username: 'string',
      token: 'string',
      sessionActive: { type: 'bool', default: true },
    },
    primaryKey: '_id',
  };
}

export class SyncQueue extends Realm.Object<SyncQueue> {
  _id!: BSON.ObjectId;
  operation!: string; // CREATE, UPDATE
  targetId!: string; // ID of the object being modified
  collection!: string; // Task, User
  payload!: string; // JSON string of the change
  timestamp!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'SyncQueue',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      operation: 'string',
      targetId: 'string',
      collection: 'string',
      payload: 'string',
      timestamp: { type: 'date', default: () => new Date() },
    },
    primaryKey: '_id',
  };
}
