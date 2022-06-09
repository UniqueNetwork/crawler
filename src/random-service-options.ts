export interface RandomServiceOptions {
  min: number;
  max: number;
}

export const defaultRandomServiceOptions: RandomServiceOptions = {
  min: 0,
  max: 1000,
};
