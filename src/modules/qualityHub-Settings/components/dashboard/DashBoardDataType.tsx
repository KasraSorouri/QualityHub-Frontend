export interface DetectedNokData {
  product: string;
  [nokStatus: string]: number | string;
}

export interface DetectedNokResponse {
  product: string;
  nokStatus: string;
  count: number;
}