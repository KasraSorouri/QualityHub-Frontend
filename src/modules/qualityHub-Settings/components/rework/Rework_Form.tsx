import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FilledTextFieldProps,
  FormControlLabel,
  Grid,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material';

import { NokCode, Station, WorkShift, Product, Recipe, ConsumingMaterial, NewRework } from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import stationServices from '../../services/stationServices';
import nokCodeServices from '../../services/nokCodeServices';
import productServices from '../../services/productServices';
import ReworkRecipeList from './ReworkRecipeList';
import recipeServices from '../../services/recipeServices';
import ReworkDismantledMaterial from './ReworkDismantleMaterial';
import reworkServices from '../../services/reworkServices';

type NokFromProps = {
  formType: 'ADD' | 'EDIT' | 'VIEW';
}

type FormData = {
  product: Product;
  reworkShortDesc: string;
  description?: string;
  order: number;
  nokCode: NokCode;
  station: Station;
  timeDuration?: number;
  active: boolean;
  deprecated: boolean;
  reworkRecipes: number[];
  affectedRecipes: number[];
  dismantledMaterials: DismantledMaterial[];
}

interface DismantledMaterial extends ConsumingMaterial {
  id: number;
  recipeCode: string;
  dismantledQty? : number;
  note?: string;
  mandatoryRemove?: boolean;
}

const ReworkForm = ({ formType }: NokFromProps) => {

  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initFormValues: FormData = {
    product: {
      id: 4, productName: 'product 3', productCode: 'P - 300', active: true,
      productGrp: { groupName: 'Group 1', groupCode: 'G - 1011', id: 1, active: true }
    },
    reworkShortDesc: 'test 1',
    description: 'test 1',
    order: 1,
    nokCode: { id: 1, nokCode: '130B', nokDesc: 'Screwing ', active: true, nokGrp: { nokGrpName: 'Screwing', nokGrpCode: 'B', nokGrpDesc: 'Screw / Nuts does not reach to enough torque', id: 1, active: true } },
    station: { id: 3, stationName: 'Work Station 3', stationCode: 'St - 130', active: true },
    timeDuration: 120,
    active: true,
    deprecated: false,
    reworkRecipes:[],
    affectedRecipes: [],
    dismantledMaterials:[],
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ affectedMaterial, setAffectedMaterial ] = useState<DismantledMaterial[]>([]);
  const [ confirmation, setConfirmation ] = useState<{reworkRecipes: boolean, affectedRecipes: boolean, dismantledMaterials: boolean}>({ reworkRecipes: false, affectedRecipes: false, dismantledMaterials: false });

  console.log('**** rework * form Values -> ', formValues);
  console.log('**** rework * confirmation -> ', confirmation);


  useEffect(() => {
    setFormValues(initFormValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formType]);

  // get Product List
  const productResults = useQuery('products', productServices.getProduct, { refetchOnWindowFocus: false });
  const productList: Product[] = productResults.data || [];

  // get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  // Get NOK Code List
  const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });
  const nokCodeList: NokCode[] = nokCodeResults.data || [];

  // Get Recipe List
  const recipeResults = useQuery(['recipes',formValues.product.id], async() => {
    const response = recipeServices.getRecipeByProduct(formValues.product.id);
    if (!response) {
      throw new Error('Failed to fetch recipes');
    }
    return response;
  },{ refetchOnWindowFocus: false, enabled: true });

  const reworkRecipes: Recipe[] = recipeResults.data?.filter(r => r.recipeType === 'REWORK') || [];
  const productionRecipes: Recipe[] = recipeResults.data?.filter(r => r.recipeType === 'PRODUCTION') || [];


  // handle Changes
  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleAutoCompeletChange = (parameter: string, newValue: Product | Station | WorkShift | NokCode) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };




  /*
  const timeHandler = (value: Dayjs | null) => {
    if (value) {
      setFormValues((prevValues: FormData) => ({
        ...prevValues,
        detectedTime: value,
      }));
    }
  };
  */

  const selectReworkRecipes = (recipeIds: number[]) => {
    const rwRecipes = recipeIds;
    setFormValues({ ...formValues,reworkRecipes: rwRecipes });
  };

  const selectAffectedRecipes = (recipeIds: number[]) => {
    const affectedRecipes = recipeIds;
    setFormValues({ ...formValues,affectedRecipes: affectedRecipes });

    // affected materials
    const affectedMaterials : DismantledMaterial[] = [];
    affectedRecipes.map(recipeId => {
      const recipe = productionRecipes.find(r => r.id === recipeId);
      if (recipe) {
        recipe.recipeMaterials?.map(recipeMaterial => {
          const newMaterial = {
            ...recipeMaterial,
            id: recipeMaterial.id,
            recipeCode: recipe.recipeCode
          };
          affectedMaterials.push(newMaterial);
        });
      }
    }
    );
    setAffectedMaterial(affectedMaterials);
  };

  // Dismantled Materials
  const selectDismantledMaterials = (dismantledMaterial: DismantledMaterial[]) => {
    const dismantledMaterials = dismantledMaterial;
    setFormValues({ ...formValues,dismantledMaterials: dismantledMaterials });
  };

  // set confirmation
  const handleConfirmChange = (form: string, value: boolean) => {
    console.log(' *++* confirmation change -> form:', form, ' ** value:', value);
    const newConfirmation = { ...confirmation, [form]: value };
    console.log(' *++* confirmation change -> newConfirmation:', newConfirmation);
    setConfirmation(newConfirmation);
  };

  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (formType === 'ADD') {
      console.log(' *** Rework * Submit form * newNokData -> ',formValues);
      const reworkData : NewRework = {
        productId: formValues.product.id,
        stationId: formValues.station.id,
        nokCodeId: formValues.nokCode.id,
        reworkShortDesc: formValues.reworkShortDesc,
        description: formValues.description,
        order: formValues.order,
        timeDuration: formValues.timeDuration,
        active: formValues.active,
        deprecated: formValues.deprecated,
        reworkRecipes: formValues.reworkRecipes,
        affectedRecipes: formValues.affectedRecipes,
        dismantledMaterials: formValues.dismantledMaterials,
      };

      const result = await reworkServices.createRework(reworkData);
      console.log(' *** NOK registeration * Submit form * result -> ', result);

    } else {
      console.log(' *** Rework * Submit form * Error -> ', 'Missing data');
    }
  };


  return (
    <Grid container direction={'column'} >
      <Box  sx={{ height: '600px', overflowY: 'scroll' , paddingRight:'10px' }}>
        <form onSubmit={handleSubmit} >
          <Grid container direction={'column'} sx={{ background: '#FEC0D4' }}>
            <Grid container width={'100%'} flexDirection={'row'} >
              <Autocomplete
                id='product'
                sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth: '200px' }}
                size='small'
                aria-required
                options={productList}
                isOptionEqualToValue={
                  (option: Product, value: Product) => option.productName === value.productName
                }
                value={formValues.product ? formValues.product : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('product', newValue)}
                getOptionLabel={(option: { productName: string; }) => option.productName}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='Product'
                    placeholder='Product'
                    size='small'
                    required
                  />
                )}
              />
              <Autocomplete
                id='station'
                sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth: '200px' }}
                size='small'
                aria-required
                options={stationList}
                isOptionEqualToValue={
                  (option: Station, value: Station) => option.stationName === value.stationName
                }
                value={formValues.station ? formValues.station : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('station', newValue)}
                getOptionLabel={(option: { stationName: string; }) => option.stationName}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='Station'
                    placeholder='Add Station'
                    size='small'
                    required
                  />
                )}
              />
              <Autocomplete
                id='nokCode'
                sx={{ marginLeft: 2, marginTop: 1, width: '10%', minWidth: '130px' }}
                size='small'
                aria-required
                options={nokCodeList}
                isOptionEqualToValue={
                  (option: NokCode, value: NokCode) => option.nokCode === value.nokCode
                }
                value={formValues.nokCode ? formValues.nokCode : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('nokCode', newValue)}
                getOptionLabel={(option: { nokCode: string; }) => option.nokCode}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='NOK Code'
                    placeholder='NOK Code'
                    size='small'
                    required
                  />
                )}
              />
              <TextField
                id='timeDuration'
                name='timeDuration'
                label='Duration'
                sx={{ marginLeft: 2, marginTop: 1 , width:'10%', minWidth: '40px' }}
                value={formValues.timeDuration}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small'
              />
              <TextField
                id='order'
                name='order'
                label='Order'
                sx={{ marginLeft: 2, marginTop: 1 , width:'10%', minWidth: '40px' }}
                value={formValues.order}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small'
              />
              <FormControlLabel
                sx={{ marginLeft: 1 }}
                control={
                  <Checkbox
                    checked={formValues.active}
                    onChange={handleChange}
                    name='active'
                    color='primary'
                  />
                }
                label='Active'
              />
              <FormControlLabel
                sx={{ marginLeft: 1 }}
                control={
                  <Checkbox
                    checked={formValues.deprecated}
                    onChange={handleChange}
                    name='deprecated'
                    color='primary'
                  />
                }
                label='Deprecated'
              />
            </Grid>
            <Grid container width={'100%'} flexDirection={'row'} >
              <TextField
                id='reworkShortDesc'
                name='reworkShortDesc'
                label='Short Description'
                sx={{ marginLeft: 2, marginTop: 1 , width:'30%' , minWidth: '450px' }}
                value={formValues.reworkShortDesc}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small'
                required
              />
              <TextField
                id='description'
                name='description'
                label='Description'
                sx={{ marginLeft: 2, marginTop: 1 , width:'55%', minWidth: '450px' }}
                value={formValues.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small'
              />
            </Grid>
            <Grid display={'flex'}>

              <Button
                type='submit'
                disabled={!confirmation.reworkRecipes || !confirmation.affectedRecipes || !confirmation.dismantledMaterials}
                variant='contained'
                color='primary'
                sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}
                size='small'>
                {submitTitle}
              </Button>
              <Button onClick={() => { console.log(' exit '); }} variant='contained' color='primary' size='small' sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}>
              Back
              </Button>
            </Grid>
            <Divider sx={{ margin:1 }}/>
            <ReworkRecipeList recipes={reworkRecipes} confirmSelection={selectReworkRecipes} confirmChange={(value) => handleConfirmChange('reworkRecipes', value)} title='Rework Recipes (Recipes used for rework)'  />
            <Divider sx={{ margin:1 }}/>
            <ReworkRecipeList recipes={productionRecipes}confirmSelection={selectAffectedRecipes} confirmChange={(value) => handleConfirmChange('affectedRecipes', value)} title='Affected Recipes (Recipes affected by rework)' />
            <Divider sx={{ margin:1 }}/>
            <ReworkDismantledMaterial affectedMaterials={affectedMaterial} confirmSelection={selectDismantledMaterials} confirmChange={(value) => handleConfirmChange('dismantledMaterials', value)}  />
          </Grid>
        </form>
      </Box>
    </Grid>
  );
};

export default ReworkForm;