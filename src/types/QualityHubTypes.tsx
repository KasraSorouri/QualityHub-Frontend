import { ReactNode } from 'react';

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
  [x: string]: ReactNode;
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
  REWORK_INPROGRESS = 'REWORK IN PROGRESS',
  REWORKED = 'REWORKED',
  SCRAPPED = 'SCRAPPED',
}

export enum MaterialStatus {
  OK = 'OK',
  SCRAPPED = 'SCRAPPED',
  IQC =  'IQC',
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
  rcas?: RCA[]
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
  rcaCodeId?: number;
}


export interface Rework {
  id: number;
  product: Product;
  reworkShortDesc: string;
  description?: string;
  order: number;
  nokCode: NokCode;
  reworkRecipes: number[];
  affectedRecipes: number[];
  station: Station;
  timeDuration?: number;
  active: boolean;
  deprecated: boolean;
  creationDate: Date;
  deprecatedDate?: Date;
  rwDismantledMaterials?: RwDismantledMaterial[];
}

export interface NewRework extends Omit<Rework, 'id' | 'product' | 'nokCode' | 'station' | 'useRecipe' | 'reworkRecipes' | 'affectedRecipes' | 'creationDate'> {
  id?: number;
  productId: number;
  nokCodeId: number;
  stationId: number;
  reworkRecipes: number[];
  affectedRecipes: number[];
  //dismantledMaterials: DismantledMaterial[];
}

interface RecipeBOM {
  id: number;
  recipe: Recipe;
  qty: number;
  material: Material;
  reusable: Reusable;
}

export interface RwDismantledMaterial {
  id: number;
  recipeBom: RecipeBOM;
  dismantledQty : number;
  note?: string;
  mandatoryRemove?: boolean;
}

export interface AffectedMaterial extends Omit<RwDismantledMaterial, 'id' | 'dismantledQty'> {
  dismantledQty? : number;
}

export interface DismantledMaterial extends Omit<RwDismantledMaterial, 'id' | 'recipeBom' | 'dismantledQty'> {
  recipeCode?: string;
  recipeDescription?: string;
  material: Material;
  recipeBomId: number;
  qty: number;
  suggestedDismantledQty?: number;
  reusable?: Reusable;
  actualDismantledQty: number;
  materialStatus? : MaterialStatus;
}

export enum ReworkStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  POSTPONED = 'POSTPONED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface NokRework {
  id?: number;
  nokId: number;
  operator: string;
  reworkDuration?: number | string;
  reworkManPower?: number | string;
  reworkShift?: WorkShift | undefined;
  reworkStation: Station | undefined;
  reworkActions?: number[];
  affectedRecipes: Recipe[];
  dismantledMaterials?: DismantledMaterial[];
  reworkNote?: string;
  materialCost?: number;
  reworkStatus: ReworkStatus;
}

export interface NewNokReworkData extends Omit<NokRework, 'operator' | 'reworkShift' | 'reworkStation' | 'affectedRecipes'> {
  reworkOperator: string;
  reworkShift: number;
  reworkStation: number | undefined;
  affectedRecipes: number[];
}