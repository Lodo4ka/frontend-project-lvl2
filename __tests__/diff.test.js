import { test, expect } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import diff from '../src/diff.mjs';
import jsonParser from '../src/parsers/json-parser.mjs';
import ymlParser from '../src/parsers/yml-parser.mjs';

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
  const [serData1, serData2] = jsonParser(file1, file2);
  const result = diff(serData1, serData2);
  expect(result).toEqual(answer);
});

test('compare two yml', () => {
  const file1 = readFile('filepath1.yml');
  const file2 = readFile('filepath2.yml');
  const [serData1, serData2] = ymlParser(file1, file2);
  const result = diff(serData1, serData2);
  expect(result).toEqual(answer);
});
