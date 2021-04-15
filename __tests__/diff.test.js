import { test, expect, beforeAll } from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import diff from '../src/diff.mjs';
import plain from '../src/formatter/plain.mjs';
import stylish from '../src/formatter/stylish.mjs';
import jsonParser from '../src/parsers/json-parser.mjs';
import ymlParser from '../src/parsers/yml-parser.mjs';

const __filename = fileURLToPath((import.meta.url));
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let asnwerPlain;
let asnwerNested;

beforeAll(() => {
  asnwerPlain = readFile('plainAnswer.txt');
  asnwerNested = readFile('nestedAnswer.txt');
});

test('compare two plain json', () => {
  const file1 = readFile('ex1.json');
  const file2 = readFile('ex2.json');
  const [serData1, serData2] = jsonParser(file1, file2);
  const { diffInfo, source1, source2 } = diff(serData1, serData2);
  const result = plain(diffInfo, source1, source2);
  expect(result).toEqual(asnwerPlain);
});

test('compare two plain yml', () => {
  const file1 = readFile('filepath1.yml');
  const file2 = readFile('filepath2.yml');
  const [serData1, serData2] = ymlParser(file1, file2);
  const { diffInfo, source1, source2 } = diff(serData1, serData2);
  const result = plain(diffInfo, source1, source2);
  expect(result).toEqual(asnwerPlain);
});

test('compare two nested json', () => {
  const file1 = readFile('file1.json');
  const file2 = readFile('file2.json');
  const [serData1, serData2] = jsonParser(file1, file2);
  const { diffInfo, source1, source2 } = diff(serData1, serData2);
  const result = stylish(diffInfo, source1, source2);
  expect(result).toEqual(asnwerNested);
});