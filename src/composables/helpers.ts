export interface PostRes {
  state: string;
}

export function useConvert(keys: string[]) {
  return { toObject, toArray };

  function toObject(duration: number[]) {
    const object = keys.reduce((acc: Record<string, number>, key, idx) => {
      acc[key] = duration[idx];
      return acc;
    }, {});
    return object;
  }

  function toArray(duration: Record<string, any>) {
    const array = keys.map((key) => {
      return duration[key];
    });
    return array;
  }
}
