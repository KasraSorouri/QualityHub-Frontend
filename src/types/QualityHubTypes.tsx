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
  traceable?: boolean;
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
  manpower?: number;
  recipeType: RecipeType;
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
  id : number;
  material: Material;
  qty: number;
  reusable: Reusable;
}

export interface ConsumingMaterialData extends Omit<ConsumingMaterial, 'material'> {
  materialId: number;
}

export enum RecipeType {
  PRODUCTION = 'PRODUCTION',
  REWORK = 'REWORK',
}

export interface NokGroup {
  id: number;
  nokGrpName: string;
  nokGrpCode: string;
  nokGrpDesc?: string;
  active: boolean;
}

export interface NokGrpData extends Omit<NokGroup, 'id'> {
  id? : number;
}

export interface NokCode {
  id: number;
  nokCode: string;
  nokDesc: string;
  nokGrp: NokGroup;
  active: boolean;
}
export interface NokCodeData extends Omit<NokCode, 'id'> {
  id?: number;
  nokGrpId: number;
}

export interface RcaCode {
  id: number;
  rcaCode: string;
  rcaDesc: string;
  active: boolean;
}

export interface RcaCodeData extends Omit<RcaCode, 'id'> {
  id?: number;
}

export interface Machine {
  id: number;
  machineName: string;
  machineCode: string;
  description?: string;
  station?: Station;
  active: boolean;
}

export interface MachineData extends Omit<Machine, 'id'> {
  id?: number;
  stationId?: number;
}

export interface WorkShift {
  id: number;
  shiftName: string;
  shiftCode: string;
  active: boolean;
}

export interface WorkShiftData extends Omit<WorkShift, 'id'> {
  id?: number;
}

export interface ClassCode {
  id: number;
  className: string;
  classCode: string;
  classDesc: string;
  active: boolean;
}

export interface ClassCodeData extends Omit<ClassCode, 'id'> {
  id?: number;
}

export interface NokData {
  id: number;
  product: Product;
  productSN: string;
  initNokCode: NokCode;
  detectedStation: Station;
  detectedShift: WorkShift;
  detectTime: Date;
  description: string;
  nokStatus: NokStatus;
  productStatus: ProductStatus;
}

export interface NewNokData extends Omit<NokData, 'id' | 'product' | 'initNokCode' | 'detectedStation' | 'detectedShift' > {
  id?: number;
  productId: number;
  detectStationId: number;
  detectShiftId: number;
  initNokCodeId: number;
  product?: Product;
  initNokCode?: NokCode;
  detectedStation?: Station;
  detectedShift?: WorkShift;
  removeReport: boolean;
}

export enum NokStatus {
  PENDING = 'PENDING',
  ANALYSED = 'ANALYSED',
  NEED_INVESTIGATION = 'NEED INVESTIGATION',
  NOT_FOUND = 'NOT FOUND'
}

export enum ProductStatus {
  NOK = 'NOK',
  REWORKED = 'REWORKED',
  SCRAPPED = 'SCRAPPED',
}

export enum MaterialStatus {
  OK = 'OK',
  SCRAPPED = 'SCRAPPED',
  CLAIMABLE = 'CLAIMABLE',
}

export enum ClaimStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
}

export interface NokAnalyseData {
  id: number;
  nok: NokData;
  nokCode: NokCode;
  causeStation: Station;
  causeShift: WorkShift;
  description: string;
  timeWaste?: number;
  materialWaste?: number;
  closed: boolean;
  closeDate: Date;
}

export interface NewNokAnalyseData extends Omit<NokAnalyseData, 'id' | 'causeStationId' | 'causeShiftId'> {
  id?: number;
  nokId: number;
  nokCodeId: number;
  causeStationId: number;
  causeShiftId: number;
}

export interface RCA {
  id: number;
  rcaCode: RcaCode;
  nokId: number;
  whCauseId?: number | string;
  whCauseName?: string;
  description?: string;
  improvSuggestion: string;
}

export interface NewRca extends Omit<RCA, 'id' | 'rcaCode'> {
  id?: number;
  rcaCodeId: number;
}


export interface Rework {
  id: number;
  product: Product;
  reworkShortDesc: string;
  description?: string;
  order: number;
  nokCode: number;
  reworkRecipes: Recipe[];
  affectedRecipes: Recipe[];
  station: Station;
  timeDuration?: number;
  active: boolean;
  deprecated: boolean;
}

export interface NewRework extends Omit<Rework, 'id' | 'product' | 'nokCode' | 'station' | 'useRecipe' | 'reworkRecipes' | 'affectedRecipes'> {
  id?: number;
  productId: number;
  nokCodeId: number;
  stationId: number;
  reworkRecipes: number[];
  affectedRecipes: number[];
  dismantledMaterials: DismantledMaterial [];
}

export interface DismantledMaterial {
  id: number;
  recipeCode: string;
  dismantledQty? : number;
  note?: string;
  mandatoryRemove?: boolean;
}