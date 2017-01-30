import * as firebase from 'firebase';

import { User } from './user.model';

const username = 'test';
const created_at = 1;
const updated_at = 1;

describe('UserModel', () => {
  it('should create a new User object', () => {
    const user = new User({ username, created_at, updated_at });

    expect(user instanceof User).toBe(true);
    expect(user.username).toBe(username);
    expect(user.created_at).toBe(created_at);
    expect(user.updated_at).toBe(updated_at);
  });

  it('should use default timestamps from Firebase if undefined', () => {
    const user = new User({ username });

    expect(user.created_at).toEqual(firebase.database.ServerValue.TIMESTAMP);
    expect(user.updated_at).toEqual(firebase.database.ServerValue.TIMESTAMP);
  });
});
