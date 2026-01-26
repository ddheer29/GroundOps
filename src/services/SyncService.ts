import { Realm } from '@realm/react';
import { SyncQueue, Task, User } from '../database/schemas';
import { ApiClient } from '../api/client';

export class SyncService {
  private realm: Realm;
  private isSyncing: boolean = false;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  async syncPendingChanges() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const pendingItems = this.realm.objects(SyncQueue).sorted('timestamp');
      console.log(`Found ${pendingItems.length} items to sync.`);

      for (const item of pendingItems) {
        try {
            await this.processQueueItem(item);
            this.realm.write(() => {
                this.realm.delete(item);
            });
        } catch (e) {
            console.error('Failed to sync item', e);
            // Optionally implement retry count logic here
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async processQueueItem(item: SyncQueue) {
    const user = this.realm.objects(User)[0];
    if (!user || !user.token) return;

    if (item.collection === 'Task') {
        const payload = JSON.parse(item.payload);
        await ApiClient.syncTask(payload, user.token);
        
        // Update local task to synced
        if (item.operation === 'UPDATE' || item.operation === 'CREATE') {
            const task = this.realm.objectForPrimaryKey<Task>(Task, item.targetId);
            if (task) {
                this.realm.write(() => {
                    task.isSynced = true;
                });
            }
        }
    }
  }

  async pullLatestData() {
      const user = this.realm.objects(User)[0];
      if (!user || !user.token) return;

      try {
          const tasks = await ApiClient.fetchTasks(user.token);
          console.log(`Fetched ${tasks.length} tasks from server.`);
          
          this.realm.write(() => {
              for (const remoteTask of tasks) {
                  // Upsert logic: Update if exists, Insert if not
                  const existingTask = this.realm.objectForPrimaryKey<Task>(Task, remoteTask._id);
                  
                  // Only update if remote is newer or we don't have pending local changes?
                  // For simplicity: Server wins unless we have unsynced local changes (Conflict handling).
                  
                  let shouldUpdate = true;
                  if (existingTask) {
                      // Check if we have modified it locally and not synced yet?
                      // The 'isSynced' flag is true if we are in sync with what we last sent.
                      // If we have pending changes in SyncQueue for this ID, we might not want to overwrite blindly.
                      
                      const pendingChanges = this.realm.objects(SyncQueue).filtered(`targetId == "${remoteTask._id}"`);
                      if (pendingChanges.length > 0) {
                          console.log(`Skipping update for task ${remoteTask._id} due to pending local changes.`);
                          shouldUpdate = false;
                      }
                  }

                  if (shouldUpdate) {
                     this.realm.create('Task', {
                         _id: remoteTask._id,
                         title: remoteTask.title,
                         description: remoteTask.description,
                         location: remoteTask.location,
                         status: remoteTask.status,
                         priority: remoteTask.priority,
                         notes: remoteTask.notes || '',
                         updatedAt: new Date(remoteTask.updatedAt),
                         isSynced: true, // It comes from server, so it is synced
                     }, Realm.UpdateMode.Modified); 
                  }
              }
          });
      } catch (e) {
          console.error("Pull failed", e);
      }
  }
}
