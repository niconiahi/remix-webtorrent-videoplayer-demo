import { createRanges, resetRanges } from "~/utils/ranges";

test("composeRange should correctly compose ranges", () => {
  const range1 = [1, 2, 3, 6, 7, 8, 11, 12, 13, 14];
  const result1 = createRanges(range1);
  expect(result1).toEqual(["1-3", "6-8", "11-14"]);

  const range2 = [5, 6, 7, 10, 11, 12];
  const result2 = createRanges(range2);
  expect(result2).toEqual(["5-7", "10-12"]);

  const range3 = [1, 2, 3];
  const result3 = createRanges(range3);
  expect(result3).toEqual(["1-3"]);

  const range4 = [1, 3, 5];
  const result4 = createRanges(range4);
  expect(result4).toEqual(["1", "3", "5"]);
});

test("parseRange should correctly parse ranges", () => {
  const parsedRange1 = ["1-3", "6-8", "11-14"];
  const result1 = resetRanges(parsedRange1);
  expect(result1).toEqual([1, 2, 3, 6, 7, 8, 11, 12, 13, 14]);

  const parsedRange2 = ["5-7", "10-12"];
  const result2 = resetRanges(parsedRange2);
  expect(result2).toEqual([5, 6, 7, 10, 11, 12]);

  const parsedRange3 = ["1-3"];
  const result3 = resetRanges(parsedRange3);
  expect(result3).toEqual([1, 2, 3]);

  const parsedRange4 = ["1", "3", "5"];
  const result4 = resetRanges(parsedRange4);
  expect(result4).toEqual([1, 3, 5]);
});
