/**
 * TypeScript sample — keywords, types, generics, decorators, regex.
 * Inspect tokens: Command Palette → "Developer: Inspect Editor Tokens and Scopes"
 */

import { readFile } from 'node:fs/promises';

export interface User {
  readonly id: string;
  name: string;
  roles: Role[];
}

export type Role = 'admin' | 'member' | 'guest';

const EMAIL_RE = /^[\w.-]+@[\w.-]+\.\w{2,}$/u;
const deprecatedApi = 'use fetchUser instead'; // invalid.deprecated if enabled

function decorator(target: unknown) {
  return target;
}

@decorator
export class UserService {
  private cache = new Map<string, User>();

  constructor(private readonly baseUrl: string) {}

  async fetchUser(id: string): Promise<User | null> {
    if (!EMAIL_RE.test(id)) {
      throw new Error(`Invalid id: ${id}`);
    }

    const cached = this.cache.get(id);
    if (cached) return cached;

    const response = await fetch(`${this.baseUrl}/users/${id}`);
    if (!response.ok) return null;

    const user = (await response.json()) as User;
    this.cache.set(id, user);
    return user;
  }

  static parseRoles(raw: string): Role[] {
    return raw.split(',').map((r) => r.trim() as Role);
  }
}

export function greet(user: User): string {
  const title = user.roles.includes('admin') ? 'Admin' : 'User';
  return `Hello, ${title} ${user.name}!`;
}

// Bracket nesting for pair colorization
const matrix = [
  [1, [2, [3, [4]]]],
  { a: { b: { c: true } } },
];

// Semantic: parameter vs property vs method vs builtin
const service = new UserService('https://api.example.com');
service.fetchUser('abc').then(console.log);

export default UserService;
