import {
  test, expect, beforeAll, describe,
} from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import diff from '../src/diff.mjs';

const __filename = fileURLToPath((import.meta.url));
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let asnwerPlain;
let asnwerNested;
let answerPlainNested;
let nestedJsonAnswer;
let nestedJsonAnswerCi;

describe('check parser with all formatters', () => {
  beforeAll(() => {
    // asnwerPlain = readFile('plainAnswer.txt');
    // asnwerNested = readFile('nestedAnswer.txt');
    // answerPlainNested = readFile('plainNestedAnswer.txt');
    // nestedJsonAnswer = readFile('nestedJsonAnswer.txt');
    nestedJsonAnswerCi = readFile('result_stylish_ci.txt');
  });

  // test('compare two plain json', () => {
  //   const file1 = getFixturePath('ex1.json');
  //   const file2 = getFixturePath('ex2.json');
  //   const result = diff(file1, file2, 'common');
  //   expect(result).toEqual(asnwerPlain);
  // });

  // test('compare two plain yml', () => {
  //   const file1 = getFixturePath('filepath1.yml');
  //   const file2 = getFixturePath('filepath2.yml');
  //   const result = diff(file1, file2, 'common');
  //   expect(result).toEqual(asnwerPlain);
  // });

  // test('compare two nested json with format stylishFormatter', () => {
  //   const file1 = getFixturePath('file1.json');
  //   const file2 = getFixturePath('file2.json');
  //   const result = diff(file1, file2, 'stylish');
  //   expect(result).toEqual(asnwerNested);
  // });

  // test('compare two nested yml with format plain', () => {
  //   const file1 = getFixturePath('file1y.yml');
  //   const file2 = getFixturePath('file2y.yml');
  //   const result = diff(file1, file2, 'plain');
  //   expect(result).toEqual(answerPlainNested);
  // });

  // test('compare two nested yml with format json', () => {
  //   const file1 = getFixturePath('file1y.yml');
  //   const file2 = getFixturePath('file2y.yml');
  //   const result = diff(file1, file2, 'json');
  //   expect(result).toEqual(nestedJsonAnswer);
  // });

  test('compare two nested json with format stylish', () => {
    const file1 = getFixturePath('file1_ci.json');
    const file2 = getFixturePath('file2_ci.json');
    const result = diff(file1, file2, 'stylish');
    expect(result).toEqual(nestedJsonAnswerCi);
  });
});
