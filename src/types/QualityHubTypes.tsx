export interface Product {
  id: number;
  productName: string;
  productCode: string;
  active: boolean;
  productGrp: ProductGroup;
}

export interface NewProduct extends Omit<Product,'id' | 'productGrp'> {
  productGrpId: number;
}

export interface UpdateProductData extends Omit<Product,'productGrp'> {
  productGrpId: number;
}


export interface ProductGroup {
  id: number;
  groupName: string;
  groupCode: string;
  active: boolean;
}

export interface NewProductGrp extends Omit<ProductGroup,'id'> {
  id?: number;
}


export interface WorkShift {
  id: number;
  shiftName: string;
  shiftCode: string;
  active: boolean;
}

export interface WorkShiftData extends Omit<WorkShift,'id'> {}

export interface Station {
  id: number;
  stationName: string;
  stationCode: string;
  active: boolean;
}

export interface NewStation extends Omit<Station,'id'> {
  id?: number;
}


export interface Material {
  id: number;
  itemShortName: string;
  itemLongName: string;
  itemCode: string;
  price?: number;
  unit?: string;
  active: boolean;
}


export interface NewMaterial extends Omit<Material,'id'> {
  id?: number;
}

export interface Unit {
  id: number;
  unitName: string;
}

export interface Recipe {
  id: number;
  recipeCode: string;
  description: string;
  order: number;
  product: Product;
  station: Station;
  timeDuration?: number;
  active: boolean;
  recipeMaterials?: ConsumingMaterial[];
}

export interface RecipeData extends Omit<Recipe,'id' | 'product' | 'station' | 'materials'> {
  id?: number;
  productId: number;
  stationId: number;
  materialsData: ConsumingMaterialData[];
}

export enum Reusable  {
  YES ='YES',
  NO = 'NO',
  IQC = 'IQC'
}

export interface ConsumingMaterial {
  material: Material;
  qty: number;
  reusable: Reusable;
}

export interface ConsumingMaterialData extends Omit<ConsumingMaterial, 'material'> {
  materialId: number;
}