import {
  test, expect, describe,
} from '@jest/globals';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import diff from '../src/diff.js';

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

  test('compare two nested json with format stylishFormatter', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    const result = diff(file1, file2, 'stylish');
    expect(result).toEqual(asnwerNested);
  });

  test('compare two nested json with default formatter', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    const result = diff(file1, file2);
    expect(result).toEqual(asnwerNested);
  });

  test('compare two nested json with format stylish from CI', () => {
    const file1 = getFixturePath('file1_ci.json');
    const file2 = getFixturePath('file2_ci.json');
    const result = diff(file1, file2, 'stylish');
    expect(result).toEqual(nestedAnswerCI);
  });

  test('compare two nested json with format plain from CI', () => {
    const file1 = getFixturePath('file1_ci.json');
    const file2 = getFixturePath('file2_ci.json');
    const result = diff(file1, file2, 'plain');
    expect(result).toEqual(plainNestedCI);
  });

  test('compare two nested yml with format plain', () => {
    const file1 = getFixturePath('file1y.yml');
    const file2 = getFixturePath('file2y.yml');
    const result = diff(file1, file2, 'plain');
    expect(result).toEqual(answerPlainNested);
  });

  test('compare two nested yml with format json', () => {
    const file1 = getFixturePath('file1y.yml');
    const file2 = getFixturePath('file2y.yml');
    const result = diff(file1, file2, 'json');
    expect(result).toEqual(nestedJsonAnswer);
  });

  test('compare two nested yml with format stylish from CI', () => {
    const file1 = getFixturePath('file1_ci.yml');
    const file2 = getFixturePath('file2_ci.yml');
    const result = diff(file1, file2, 'stylish');
    expect(result).toEqual(nestedAnswerCI);
  });

  test('compare two nested yml with format plain from CI', () => {
    const file1 = getFixturePath('file1_ci.yml');
    const file2 = getFixturePath('file2_ci.yml');
    const result = diff(file1, file2, 'plain');
    expect(result).toEqual(plainNestedCI);
  });
});
