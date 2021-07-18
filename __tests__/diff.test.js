import {
  test, expect, describe,
} from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import generateDiff from '../src/generateDiff.js';

const __filename = fileURLToPath((import.meta.url));
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('check parser with all formatters', () => {
  const asnwerNested = readFile('nestedAnswer.txt');
  const answerPlainNested = readFile('plainNestedAnswer.txt');
  const nestedJsonAnswer = readFile('nestedJsonAnswer.txt');
  const nestedAnswerCI = readFile('result_stylish_ci.txt');
  const plainNestedCI = readFile('result_plain_ci.txt');

  test.each`
    title | file1 | file2 | formatter | expected
    ${'compare two nested json with format stylishFormatter'} | ${'file1.json'} | ${'file2.json'} | ${'stylish'} | ${asnwerNested}
    ${'compare two nested json with default formatter'} | ${'file1.json'} | ${'file2.json'} | ${undefined} | ${asnwerNested}
    ${'compare two nested json with format stylish from CI'} | ${'file1_ci.json'} | ${'file2_ci.json'} | ${'stylish'} | ${nestedAnswerCI}
    ${'compare two nested json with format plain from CI'} | ${'file1_ci.json'} | ${'file2_ci.json'} | ${'plain'} | ${plainNestedCI}
    ${'compare two nested yml with format plain'} | ${'file1y.yml'} | ${'file2y.yml'} | ${'plain'} | ${answerPlainNested}
    ${'compare two nested yml with format json'} | ${'file1y.yml'} | ${'file2y.yml'} | ${'json'} | ${nestedJsonAnswer}
    ${'compare two nested yml with format stylish from CI'} | ${'file1_ci.yml'} | ${'file2_ci.yml'} | ${'stylish'} | ${nestedAnswerCI}
    ${'compare two nested yml with format plain from CI'} | ${'file1_ci.yml'} | ${'file2_ci.yml'} | ${'plain'} | ${plainNestedCI}
  `('$title', ({
    file1, file2, formatter, expected,
  }) => {
    const fixture1 = getFixturePath(file1);
    const fixture2 = getFixturePath(file2);
    const result = generateDiff(fixture1, fixture2, formatter);
    expect(result).toEqual(expected);
  });
});
