interface MagnetParameters {
  [key: string]: string | string[];
}

export function decodeMagnet(uri: string): MagnetParameters {
  return uri
    .split("magnet:?")[1]
    .split("&")
    .map(deserializeParameter)
    .reduce(resetParameters, {});
}

function deserializeParameter(param: string): [string, string] {
  const [key, value] = param.split("=");
  return [key, decodeURIComponent(value)];
}

function resetParameters(
  params: MagnetParameters,
  [key, value]: [string, string]
): MagnetParameters {
  const existingValue = params[key];
  const nextParams = {
    ...params,
    [key]: existingValue
      ? Array.isArray(existingValue)
        ? [...existingValue, value]
        : [existingValue, value]
      : value,
  };

  return nextParams;
}

interface MagnetParams {
  xt?: string | string[];
  dn?: string;
  tr?: string | string[];
  xs?: string;
  name?: string;
  keywords?: string;
  announce?: string;
  urlList?: string[];
  peerAddresses?: string;
  infoHashBuffer?: Buffer;
  infoHash?: string;
  infoHashV2Buffer?: Buffer;
  infoHashV2?: string;
}

export function encodeMagnet(params: MagnetParams): string {
  const paramString = Object.entries(params)
    .reduce(composeParameters, [])
    .map(serializeParameter)
    .join("&");

  return `magnet:?${paramString}`;
}

function composeParameters(
  result: [string, any][],
  [key, value]: [string, any]
): [string, any][] {
  if (Array.isArray(value)) {
    return result.concat(value.map((v) => [key, v]));
  } else if (value !== undefined) {
    return result.concat([[key, value]]);
  } else {
    return result;
  }
}

function serializeParameter([key, value]: [string, any]): string {
  if (Array.isArray(value)) {
    return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
  } else {
    const encodedValue =
      key === "xt" ? value : encodeURIComponent(value.toString());
    return `${key}=${encodedValue}`;
  }
}
