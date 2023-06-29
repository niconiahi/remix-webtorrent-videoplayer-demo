export function decodeMagnet(encodedMagnet: string) {
  if (!encodedMagnet.includes("magnet:?")) {
    throw new Error("invalid magnet URL");
  }
  const parts = encodedMagnet
    .replace("magnet:?", "")
    .split("&")
    .map((part) => part.split("="));

  const groups = Object.entries(
    parts.reduce<{ [group: string]: string | string[] }>(
      (prevGroups, [key, value]) => {
        const count = parts.filter(([_key]) => _key === key).length;

        return {
          ...prevGroups,
          [key]: count > 1 ? [...(prevGroups[key] ?? []), value] : value,
        };
      },
      {}
    )
  );
  const data = groups.reduce<{ [group: string]: string | string[] }>(
    (prevData, group) => {
      const key = group[0];
      const nextValue = getNextValue(group);

      return { ...prevData, [key]: nextValue };
    },
    {}
  );

  console.log("decodeMagnet ~ data:", data);
  return data;
}

function getNextValue([key, value]: [string, string | string[]]) {
  if (key === "xt") return value;
  if (key === "dn") return decodeURIComponent(value as string);
  if (key === "tr")
    return Array.isArray(value)
      ? value.map((_value) => decodeURIComponent(_value))
      : decodeURIComponent(value);

  return "";
}
