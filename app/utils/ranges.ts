export function createRanges(numbers: number[]) {
  return numbers
    .reduce<number[][]>((ranges, nextNumber, index, numbers) => {
      if (index === 0 || nextNumber !== numbers[index - 1] + 1) {
        return [...ranges, [nextNumber]];
      } else {
        const lastRange = ranges[ranges.length - 1];

        return [
          ...ranges.slice(0, ranges.length - 1),
          [...lastRange, nextNumber],
        ];
      }
    }, [])
    .map((ranges) => {
      return ranges.length > 1
        ? `${ranges[0]}-${ranges[ranges.length - 1]}`
        : `${ranges[0]}`;
    });
}

export function resetRanges(ranges: string[]) {
  const createNumbers = (start: number, end: number = start) =>
    Array.from({ length: end - start + 1 }, (_, index) => index + start);

  return ranges.reduce<number[]>((numbers, nextRange) => {
    const range = nextRange.split("-").map((cur) => parseInt(cur));
    return numbers.concat(createNumbers(range[0], range[1]));
  }, []);
}
