import * as firebase from 'firebase';

export class User {
  username: string;
  created_at: number | Object;
  updated_at: number | Object;

  constructor(data: {
    username: string;
    created_at?: number;
    updated_at?: number;
  }) {
    this.username = data.username;
    this.created_at = data.created_at || firebase.database.ServerValue.TIMESTAMP;
    this.updated_at = data.updated_at || firebase.database.ServerValue.TIMESTAMP;
  }
}
