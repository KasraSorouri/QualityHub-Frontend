export interface DetectedNokData {
  productName: string;
  pending: number;
  analysed: number;
}

export interface ProductNokData {
  productName: string;
  shifts: { [key: string]: number };
};

export interface DashboardNokAnalysedData {
  shifts: string[];
  productsNok: ProductNokData[];
}

