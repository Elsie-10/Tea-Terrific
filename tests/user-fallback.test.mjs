import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import User from '../models/User.js';

test('fallback user store can create and read a user without MongoDB', async () => {
  const dbPath = path.join(process.cwd(), 'data', 'users.json');
  await fs.rm(dbPath, { force: true });

  const created = await User.create({
    name: 'Fallback User',
    email: 'fallback@example.com',
    password: 'secret123',
    role: 'customer',
    phone: '0700000000',
  });

  assert.ok(created._id, 'expected a user id');
  assert.equal(created.email, 'fallback@example.com');

  const found = User.findOne({ email: 'fallback@example.com' });
  assert.ok(found, 'expected to find the created user');
  assert.equal(found.email, 'fallback@example.com');
});
