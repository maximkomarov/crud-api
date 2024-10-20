import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

class Database {
  private data: User[] = [];

  create(user: User): User {
    const newUser = { id: uuidv4(), ...user };
    this.data.push(newUser);
    return newUser;
  }

  update(user: User, id: string): User | undefined {
    const index = this.data.findIndex((u) => u.id === id);
    if (index !== -1) {
      const updatedUser = { id: id, ...user };
      this.data[index] = updatedUser;
      return updatedUser;
    }
    return undefined;
  }

  delete(id: string): User | undefined {
    const index = this.data.findIndex((u) => u.id === id);
    if (index !== -1) {
      const deletedUser = this.data[index];
      this.data.splice(index, 1);
      return deletedUser;
    }
    return undefined;
  }

  getUsers(): User[] {
    return this.data;
  }

  getUser(id: string): User | undefined {
    return this.data.find((user) => user.id == id);
  }
}

export default Database;
