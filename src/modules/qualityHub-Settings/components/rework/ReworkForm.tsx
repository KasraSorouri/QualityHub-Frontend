import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

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
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material';

import { NokCode, Station, WorkShift, Product, Recipe, NewRework, Rework, RwDismantledMaterial, AffectedMaterial } from '../../../../types/QualityHubTypes';
import stationServices from '../../services/stationServices';
import nokCodeServices from '../../services/nokCodeServices';
import ReworkRecipeList from './ReworkRecipeList';
import recipeServices from '../../services/recipeServices';
import ReworkRwDismantledMaterial from './ReworkDismantleMaterial';
import reworkServices from '../../services/reworkServices';

type ReworkFromProps = {
  reworkData: Rework | null;
  product: Product;
  formType: 'ADD' | 'EDIT' | 'VIEW';
  displayReworkForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' | 'VIEW' }) => void;
  updateRequest : () => void;
}

type FormData = {
  product: Product;
  reworkShortDesc: string;
  description?: string;
  order: number;
  nokCode: NokCode | undefined;
  station: Station | undefined;
  timeDuration?: number;
  active: boolean;
  deprecated: boolean;
  reworkRecipes: number[];
  affectedRecipes: number[];
  rwDismantledMaterials?: RwDismantledMaterial[];
}

const ReworkForm = ({ reworkData, formType, product, displayReworkForm, updateRequest }: ReworkFromProps) => {

  const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  console.log(' **-** rework Data ->', reworkData);
  

  // convert rwDismanled Material
  const rwDismantledMaterials = reworkData?.rwDismantledMaterials?.map(material => {
    return {
      ...material,
      dismantledQty: material.dismantledQty,
    };
  });

  const initFormValues: FormData = {
    product: product,
    reworkShortDesc: reworkData ? reworkData.reworkShortDesc : '',
    description:  reworkData ? reworkData.description : '',
    order: reworkData ? reworkData.order : 1,
    nokCode: reworkData ? reworkData.nokCode : undefined,
    station: reworkData ? reworkData.station : undefined,
    timeDuration: reworkData ? reworkData.timeDuration : 0,
    active: reworkData ? reworkData.active :true,
    deprecated: reworkData ? reworkData.deprecated :false,
    reworkRecipes:reworkData?.reworkRecipes ? reworkData.reworkRecipes :[],
    affectedRecipes: reworkData?.affectedRecipes ? reworkData.affectedRecipes : [],
    rwDismantledMaterials: reworkData?.rwDismantledMaterials ? rwDismantledMaterials : [],
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ affectedMaterial, setAffectedMaterial ] = useState<AffectedMaterial[]>([]);
  const [ recipeList, setRecipeList ] = useState<Recipe[]>([]);
  const [ confirmation, setConfirmation ] = useState<{reworkRecipes: boolean, affectedRecipes: boolean, dismantledMaterials: boolean}>({ reworkRecipes: false, affectedRecipes: false, dismantledMaterials: false });

  console.log('formValues ->', formValues);

  // get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  // Get NOK Code List
  const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });
  const nokCodeList: NokCode[] = nokCodeResults.data || [];

  // Get Recipe List
  useQuery(['recipes',formValues.product.id], async() => {
    const response = recipeServices.getRecipeByProduct(formValues.product.id);
    if (!response) {
      throw new Error('Failed to fetch recipes');
    }
    return response;
  },{ refetchOnWindowFocus: false, enabled: true, onSuccess : (data) => {
    setRecipeList(data);
    updateAffectedMaterial(data, initFormValues.affectedRecipes);
  } });

  const reworkRecipes: Recipe[] = recipeList?.filter(r => r.recipeType === 'REWORK') || [];
  const productionRecipes: Recipe[] = recipeList?.filter(r => r.recipeType === 'PRODUCTION') || [];


  const updateAffectedMaterial = (recipeList: Recipe[], affectedRecipes : number[]) => {
    const affectedMaterials : AffectedMaterial[] = [];
    affectedRecipes.map(recipeId => {
      const recipe = recipeList.filter(r => r.recipeType === 'PRODUCTION').find(r => r.id === recipeId);
      if (recipe) {
        recipe.recipeMaterials?.map(recipeMaterial => {
          const newMaterial = {
            recipeBom: {
              id: recipeMaterial.id,
              recipe: recipe,
              qty: recipeMaterial.qty,
              material: recipeMaterial.material,
              reusable: recipeMaterial.reusable
            },
          };
          affectedMaterials.push(newMaterial);
        });
      }
    });
    setAffectedMaterial(affectedMaterials);
  };

  useEffect(() => {
    setFormValues(initFormValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // handle Changes
  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active'  ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleDeprecated = (event: {target: { checked: boolean }}) => {
    const { checked } = event.target;
    const newValue = checked;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      'deprecated': newValue,
      'active': checked && false,
    }));
  };

  const handleAutoCompeletChange = (parameter: string, newValue: Product | Station | WorkShift | NokCode) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };

  const selectReworkRecipes = (recipeIds: number[]) => {
    const rwRecipes = recipeIds;
    setFormValues({ ...formValues,reworkRecipes: rwRecipes });
  };

  const selectAffectedRecipes = (recipeIds: number[]) => {
    const affectedRecipes = recipeIds;
    setFormValues({ ...formValues,affectedRecipes: affectedRecipes });
    updateAffectedMaterial(recipeList, affectedRecipes);
  };

  // Dismantled Materials
  const selectRwDismantledMaterials = (dismantledMaterial: RwDismantledMaterial[]) => {
    const dismantledMaterials = dismantledMaterial;
    setFormValues({ ...formValues,rwDismantledMaterials: dismantledMaterials });
  };

  // set confirmation
  const handleConfirmChange = (form: string, value: boolean) => {
    const newConfirmation = { ...confirmation, [form]: value };
    setConfirmation(newConfirmation);
  };

  // enable Submit Button
  let disableSubmmit : boolean = true;
  if (formType === 'ADD') {
    disableSubmmit = (!formValues.reworkShortDesc || !formValues.nokCode || !formValues.station || !confirmation.affectedRecipes || !confirmation.reworkRecipes || !confirmation.dismantledMaterials );
  }
  else {
    if (formType === 'EDIT') {
      disableSubmmit = false;
    }
  }

  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (formType === 'ADD') {
      if (formValues.station && formValues.nokCode) {
        const newReworkData : NewRework = {
          productId: formValues.product.id,
          stationId: formValues.station.id,
          nokCodeId: formValues.nokCode.id,
          reworkShortDesc: formValues.reworkShortDesc,
          description: formValues.description,
          order: formValues.order,
          timeDuration: Number(formValues.timeDuration),
          active: formValues.active,
          deprecated: formValues.deprecated,
          reworkRecipes: formValues.reworkRecipes,
          affectedRecipes: formValues.affectedRecipes,
          rwDismantledMaterials: formValues.rwDismantledMaterials ? formValues.rwDismantledMaterials : [],
        };
        const result = await reworkServices.createRework(newReworkData);
        console.log(' *** NOK registeration * Submit form * result -> ', result);

      } else {
        console.log(' *** Rework * Submit form * Error -> ', 'Missing data');
      }
    }

    if (formType === 'EDIT') {
      if (formValues.station && formValues.nokCode && reworkData) {
        const newReworkData : NewRework = {
          id: reworkData.id,
          productId: formValues.product.id,
          stationId: formValues.station.id,
          nokCodeId: formValues.nokCode.id,
          reworkShortDesc: formValues.reworkShortDesc,
          description: formValues.description,
          order: formValues.order,
          timeDuration: Number(formValues.timeDuration),
          active: formValues.active,
          deprecated: formValues.deprecated,
          reworkRecipes: formValues.reworkRecipes,
          affectedRecipes: formValues.affectedRecipes,
          rwDismantledMaterials: formValues.rwDismantledMaterials ? formValues.rwDismantledMaterials : [],
        };
        const result = await reworkServices.editRework(newReworkData);
        console.log(' *** NOK registeration * Submit form * result -> ', result);

      } else {
        console.log(' *** Rework * Submit form * Error -> ', 'Missing data');
      }
    }
    updateRequest();
  };

  return (
    <Grid container direction={'column'} >
      <Box  sx={{ height: '600px', overflowY: 'scroll' , paddingRight:'10px' }}>
        <form onSubmit={handleSubmit} >
          <Grid container direction={'row'} >
            <Grid item xs={11}  >
              <Grid container width={'100%'} flexDirection={'row'} >
                <TextField
                  id='reworkShortDesc'
                  name='reworkShortDesc'
                  label='Short Description'
                  sx={{ marginLeft: 2, marginTop: 1 , width:'45%' , minWidth: '350px' }}
                  value={formValues.reworkShortDesc}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                  fullWidth
                  size='small'
                  required
                />
                <Autocomplete
                  id='station'
                  sx={{ marginLeft: 2, marginTop: 1, width: '18%', minWidth: '200px' }}
                  size='small'
                  aria-required
                  disabled={!(formType === 'ADD')}
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
                  sx={{ marginLeft: 2, marginTop: 1, width: '12%', minWidth: '130px' }}
                  size='small'
                  aria-required
                  disabled={!(formType === 'ADD')}
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
                  sx={{ marginLeft: 2, marginTop: 1 , width:'7%', minWidth: '40px' }}
                  value={formValues.timeDuration}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                  fullWidth
                  size='small'
                />
                <TextField
                  id='order'
                  name='order'
                  label='Order'
                  sx={{ marginLeft: 2, marginTop: 1 , width:'7%', minWidth: '40px' }}
                  value={formValues.order}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid container width={'100%'} flexDirection={'row'} >
                <TextField
                  id='description'
                  name='description'
                  label='Description'
                  sx={{ marginLeft: 2, marginTop: 1 , width:'75%', minWidth: '450px' }}
                  value={formValues.description}
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
                      disabled={formValues.deprecated}
                    />
                  }
                  label='Active'
                />
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  control={
                    <Checkbox
                      checked={formValues.deprecated}
                      onChange={handleDeprecated}
                      disabled={reworkData?.deprecated}
                      name='deprecated'
                      color='primary'
                    />
                  }
                  label='Deprecated'
                />
              </Grid>
            </Grid>
            <Grid item xs={1} >
              <Stack direction={'column'} >
                <Button
                  type='submit'
                  disabled={disableSubmmit}
                  variant='contained'
                  color='primary'
                  sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}
                  size='small'>
                  {submitTitle}
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  size='small'
                  sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}
                  onClick={() => { displayReworkForm({ show: false, formType: 'ADD' }); }}
                >
                Back
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ margin:1 }}/>
          <ReworkRecipeList recipes={reworkRecipes} selectedRecipes={reworkData?.reworkRecipes ? reworkData.reworkRecipes : []} confirmSelection={selectReworkRecipes} confirmChange={(value) => handleConfirmChange('reworkRecipes', value)} title='Rework Recipes (Recipes used for rework)' editable={formType === 'ADD' ? true : false } />
          <Divider sx={{ margin:1 }}/>
          <ReworkRecipeList recipes={productionRecipes} selectedRecipes={reworkData?.affectedRecipes ? reworkData.affectedRecipes : []} confirmSelection={selectAffectedRecipes} confirmChange={(value) => handleConfirmChange('affectedRecipes', value)} title='Affected Recipes (Recipes affected by rework)' editable={formType === 'ADD' ? true : false } />
          <Divider sx={{ margin:1 }}/>
          <ReworkRwDismantledMaterial affectedMaterials={affectedMaterial} rwRwDismantledMaterial={reworkData?.rwDismantledMaterials} confirmSelection={selectRwDismantledMaterials} confirmChange={(value) => handleConfirmChange('dismantledMaterials', value)} editable={formType === 'ADD' ? true : false }  />
        </form>
      </Box>
    </Grid>
  );
};

export default ReworkForm;