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

export interface NokCodeS extends  Omit<NokCode, 'nokGrp' | 'active'>{}

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
  removeReport?: boolean;
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
  nok?: NokData;
  nokCode: NokCodeS;
  causeStation: Station;
  causeShift: WorkShift;
  classCode: ClassCode;
  description: string;
  timeWaste?: number;
  materialWaste?: number;
  closed: boolean;
  closeDate?: Date;
  rcas?: RCA[]
  costResult?: {[key: string]: number }
}

export interface NewNokAnalyseData extends Omit<NokAnalyseData, 'id' | 'nok' | 'nokCode' | 'causeStation' | 'causeShift' | 'classCode'| 'costResult'> {
  id?: number;
  nokId: number;
  nokCodeId: number;
  causeStationId: number;
  causeShiftId: number;
  classCodeId: number;
}

export interface RCA {
  id: number;
  rcaCode: RcaCode;
  nokId: number;
  whCauseId?: number | string;
  whCauseName?: string;
  description?: string;
  improveSuggestion: string;
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
  rwDismantledMaterial: RwDismantledMaterial;
  id: number;
  recipeBom: RecipeBOM;
  dismantledQty : number;
  note?: string;
  mandatoryRemove?: boolean;
  reusable?: Reusable;
}
/*
export interface AffectedMaterial extends Omit<RwDismantledMaterial, 'id' | 'dismantledQty'> {
  dismantledQty? : number;
}
*/
export interface NokDismantledMaterial {
  id: number | undefined;
  rwDismantledMaterialId: number  ;
  recipeCode?: string;
  recipeDescription?: string;
  material: Material;
  recipeBomId: number;
  recipeQty: number;
  suggestedDismantledQty?: number;
  actualDismantledQty: number;
  reusable?: Reusable;
  materialStatus? : MaterialStatus;
  rwDismantledMaterial?: RwDismantledMaterial;
  recipeBom?: RecipeBOM;
}

export interface DismantledMaterialData extends Omit<NokDismantledMaterial,  'rwDismantledMaterialId' |'recipeBomId' > {
  isSelected: boolean;
  index: number;
  rwDismantledMaterialId?: number;
  recipeBomId?: number;
  rwNote?: string;
  mandatoryRemove?: boolean;
}

export interface AffectedMaterial extends Omit<NokDismantledMaterial, 'id' | 'actualDismantledQty' | 'reusable' | 'materialStatus'> {
  mandatoryRemove?: boolean;
  reusable?: Reusable;
  rwNote?: string;
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
  reworkOperator: string;
  reworkDuration?: number | string;
  reworkManPower?: number | string;
  reworkShift?: WorkShift | undefined;
  reworkStation: Station | undefined;
  reworkActionsId?: number[];
  affectedRecipes: Recipe[];
  nokDismantleMaterials?: NokDismantledMaterial[];
  reworkNote?: string;
  materialCost?: number;
  reworkStatus: ReworkStatus;
}

export interface NewNokReworkData extends Omit<NokRework, 'operator' | 'reworkShift' | 'reworkStation' | 'affectedRecipes' | 'nokDismantleMaterials'> {
  reworkOperator: string;
  reworkShift: number;
  reworkStation: number | undefined;
  affectedRecipes: number[];
  nokDismantleMaterials: DismantledMaterialData[] | undefined;
}

export interface DismanteledMaterialData {
  nokId: number;
  reworkId: number;
  materialId: number;
  material: Material;
  qty: number;
  materialStatus: MaterialStatus;
}

export interface CostMaterialData {
  materialId: number;
  materialName: string;
  registeredPrice : number;
  dismantledQty : number;
  status: MaterialStatus;
  unitPrice: number;
}
export interface NewNokCostData {
  nokId: number;
  reworkId: number;
  dismantledMaterial: Omit<CostMaterialData, 'materialName'>[];
}

export interface ClaimListData {
  id: number;
  material: Material;
  actualDismantledQty: number;
  nokDetect: NokData;
  nokCode: NokCode;
  nokAnalyse: NokAnalyseData;
  nokRework: NokRework;
  product: Product;
  productSN: string;
  claimStatus: ClaimStatus;
  unitPrice: number;
}

export interface Claim {
  id?: number;
  dismantledMaterialId: number;
  date: Date;
  claimStatus: ClaimStatus;
  referenceType?: string;
  reference?: string;
  description?: string;
}

export interface IQCListData {
  id: number;
  material: Material;
  materialStatus: MaterialStatus;
  actualDismantledQty: number;
  nokDetect: NokData;
  nokCode: NokCode;
  nokAnalyse: NokAnalyseData;
  nokRework: NokRework;
  product: Product;
  reusable: Reusable;
  productSN: string;
  unitPrice: number;
}

export interface IQCData {
  id?: number;
  dismantledMaterialId: number;
  date: Date;
  materialStatus: MaterialStatus;
  reference?: string;
  description?: string;
}
