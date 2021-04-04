import { test, expect } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import diffJSON from '../src/diffJSON.mjs';

const __filename = fileURLToPath((import.meta.url));
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const answer = {
  '- follow': false,
  host: 'hexlet.io',
  '- proxy': '123.234.53.22',
  '- timeout': 50,
  '+ timeout': 20,
  '+ verbose': true,
};

test('compare two json', () => {
  const file1 = readFile('ex1.json');
  const file2 = readFile('ex2.json');
  const result = diffJSON(file1, file2);
  expect(result).toEqual(answer);
});
