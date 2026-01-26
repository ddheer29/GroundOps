import { Realm } from '@realm/react';
import { User } from '../database/schemas';
import { ApiClient } from '../api/client';

export class AuthService {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  async login(username: string, password: string) {
    try {
      // 1. Online Login
      const response = await ApiClient.login(username, password);
      
      // 2. Save Session Locally
      this.realm.write(() => {
        // Clear previous sessions
        const users = this.realm.objects(User);
        this.realm.delete(users);

        // Create new session
        this.realm.create('User', {
            _id: new Realm.BSON.ObjectId(),
            username: response.user.username,
            token: response.token,
            sessionActive: true
        });
      });

      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout() {
    this.realm.write(() => {
      const users = this.realm.objects(User);
      this.realm.delete(users);
    });
  }

  getCurrentUser() {
    return this.realm.objects(User)[0];
  }
}
