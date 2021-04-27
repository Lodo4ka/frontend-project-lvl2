import {
  test, expect, beforeAll, describe,
} from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import diff from '../src/diff.mjs';
import plainFormatter from '../src/formatter/plain.mjs';
import stylishFormatter from '../src/formatter/stylish.mjs';
import commonFormatter from '../src/formatter/common.mjs';
import jsonFormatter from '../src/formatter/json.mjs';
import jsonParser from '../src/parsers/json-parser.mjs';
import ymlParser from '../src/parsers/yml-parser.mjs';

const __filename = fileURLToPath((import.meta.url));
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let asnwerPlain;
let asnwerNested;
let answerPlainNested;
let nestedJsonAnswer;

describe('check parser with all formatters', () => {
  beforeAll(() => {
    asnwerPlain = readFile('plainAnswer.txt');
    asnwerNested = readFile('nestedAnswer.txt');
    answerPlainNested = readFile('plainNestedAnswer.txt');
    nestedJsonAnswer = readFile('nestedJsonAnswer.txt');
  });

  test('compare two plain json', () => {
    const file1 = readFile('ex1.json');
    const file2 = readFile('ex2.json');
    const [serData1, serData2] = jsonParser(file1, file2);
    const diffInfo = diff(serData1, serData2);
    const result = commonFormatter(diffInfo);
    expect(result).toEqual(asnwerPlain);
  });

  test('compare two plain yml', () => {
    const file1 = readFile('filepath1.yml');
    const file2 = readFile('filepath2.yml');
    const [serData1, serData2] = ymlParser(file1, file2);
    const diffInfo = diff(serData1, serData2);
    const result = commonFormatter(diffInfo);
    expect(result).toEqual(asnwerPlain);
  });

  test('compare two nested json with format stylishFormatter', () => {
    const file1 = readFile('file1.json');
    const file2 = readFile('file2.json');
    const [serData1, serData2] = jsonParser(file1, file2);
    const diffInfo = diff(serData1, serData2);
    const result = stylishFormatter(diffInfo);
    expect(result).toEqual(asnwerNested);
  });

  test('compare two nested yml with format plain', () => {
    const file1 = readFile('file1y.yml');
    const file2 = readFile('file2y.yml');
    const [serData1, serData2] = ymlParser(file1, file2);
    const diffInfo = diff(serData1, serData2);
    const result = plainFormatter(diffInfo);
    expect(result).toEqual(answerPlainNested);
  });

  test('compare two nested yml with format json', () => {
    const file1 = readFile('file1y.yml');
    const file2 = readFile('file2y.yml');
    const [serData1, serData2] = ymlParser(file1, file2);
    const diffInfo = diff(serData1, serData2);
    const result = jsonFormatter(diffInfo);
    expect(result).toEqual(nestedJsonAnswer);
  });
});
