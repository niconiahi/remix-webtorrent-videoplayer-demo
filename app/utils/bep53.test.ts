import { expect, test } from "vitest";

import { composeRange, resetRange } from "~/utils/bep53";

test("parse: a number", () => {
  const range = resetRange(["1"]);

  expect(range).toEqual([1]);
});

test("parse: one range", () => {
  const range = resetRange(["1-3"]);

  expect(range).toEqual([1, 2, 3]);
});

test("parse: multiple ranges", () => {
  const range = resetRange(["1-3", "11-13"]);

  expect(range).toEqual([1, 2, 3, 11, 12, 13]);
});

test("parse: multiple ranges between a number", () => {
  const range = resetRange(["1-3", "6", "11-13"]);

  expect(range).toEqual([1, 2, 3, 6, 11, 12, 13]);
});

test("compose: a number", () => {
  const range = composeRange([1]);

  expect(range).toEqual(["1"]);
});

test("compose: one range", () => {
  const range = composeRange([1, 2, 3]);

  expect(range).toEqual(["1-3"]);
});

test("compose: multiple ranges", () => {
  const range = composeRange([1, 2, 3, 11, 12, 13]);

  expect(range).toEqual(["1-3", "11-13"]);
});

test("compose: multiple ranges between a number", () => {
  const range = composeRange([1, 2, 3, 6, 11, 12, 13]);

  expect(range).toEqual(["1-3", "6", "11-13"]);
});
