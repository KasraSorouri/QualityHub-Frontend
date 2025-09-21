export interface DetectedNokData {
  productName: string;
  pending: number;
  analysed: number;
}

export interface ProductNokData {
  productName: string;
  shifts: { [key: string]: number };
}

export interface DashboardNokAnalysedData {
  shifts: string[];
  productsNok: ProductNokData[];
}

export interface TopNokData {
  productName: string;
  nokCode: string;
  count: number;
  shifts: { [key: string]: number };
}

export interface DashboardTopNokData {
  shifts: string[];
  TopNok: TopNokData[];
}