import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  Autocomplete,
  Button,
  FilledTextFieldProps,
  FormControlLabel,
  Grid,
  OutlinedTextFieldProps,
  Radio,
  RadioGroup,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material';

import { Station, WorkShift, NokAnalyseData, NewNokAnalyseData, NokData, Rework, NewNokReworkData, ReworkStatus, NokDismantledMaterial, AffectedMaterial, DismantledMaterialData } from '../../../../types/QualityHubTypes';
import nokDetectServices from '../../services/nokDetectServices';
import NOK_Info from './NOK_Info';
import ReworkChooseList from './ReworkChooseList';
import NokDismantledMaterialForm from './NOK_DismantledMaterial';
import stationServices from '../../services/stationServices';
import workShiftServices from '../../services/workShiftServices';
import nokReworkServices from '../../services/nokReworkServices';

type NokFromProps = {
  nokId: number,
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokAnalyseData?: NokAnalyseData | NewNokAnalyseData  | null;
  removeNok: (nok: null) => void;
}

type FormData = {
  id : number | undefined;
  materialCost?: number;
  operator: string;
  duration?: number | string;
  manPower?: number | string;
  reworkShift?: WorkShift | undefined;
  reworkStation: Station | undefined;
  reworkActions: number[];
  affectedRecipes?: number[],
  dismantledMaterials?: DismantledMaterialData[];
  note?: string;
  reworkStatus?: ReworkStatus;
}

const NokReworkForm = ({ nokId, formType, removeNok }: NokFromProps) => {

  const initFormValues: FormData = {
    id: undefined,
    operator: '',
    duration: '',
    manPower: '',
    reworkShift: undefined,
    reworkStation: undefined,
    note: '',
    reworkActions: [],
    reworkStatus: ReworkStatus.IN_PROGRESS,
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ nok, setNok ] = useState<NokData | null>(null);
  const [ affectedMaterials, setAffectedMaterial ] = useState<AffectedMaterial[] | never[]>([]);

  const [ confirmation, setConfirmation ] = useState<{chooseReworks: boolean, dismantledMaterials: boolean}>({ chooseReworks: false, dismantledMaterials: false });

  console.log('Nok Rework fprm ** formValues -> ',formValues);

  const convertDismanltedMaterial = (dismantledMaterials: NokDismantledMaterial[]) => {
    const dismantledMaterialsData = dismantledMaterials?.map(dmMaterial => {
      const data : DismantledMaterialData = {
        isSelected: true,
        index: dmMaterial.rwDismantledMaterialId,
        id: dmMaterial.id,
        rwDismantledMaterialId: dmMaterial.rwDismantledMaterialId,
        recipeCode: dmMaterial.recipeBom?.recipe.recipeCode,
        recipeDescription: dmMaterial.recipeDescription,
        material: dmMaterial.material,
        recipeBomId: dmMaterial.recipeBomId,
        recipeQty: dmMaterial.recipeBom?.qty || 0,
        suggestedDismantledQty: dmMaterial.rwDismantledMaterial?.dismantledQty,
        mandatoryRemove: dmMaterial.rwDismantledMaterial?.mandatoryRemove,
        reusable: dmMaterial.recipeBom?.reusable,
        actualDismantledQty: dmMaterial.actualDismantledQty? dmMaterial.actualDismantledQty : 0,
        rwNote: dmMaterial.rwDismantledMaterial?.note,
        materialStatus: dmMaterial.materialStatus,
      };
      return data;
    });
    return dismantledMaterialsData;
  };

  useEffect(() => {
        const getInitData = async () => {
          const nokResult = await nokDetectServices.getNokDetectById(nokId);
          setNok(nokResult);
          const reworkResults = await nokReworkServices.getNokReworkByNokId(nokId);
          console.log('* Nok Rework Form * Rework ->', reworkResults);
          const newFormValue: FormData = {
            id: reworkResults.id || undefined,
            operator: reworkResults.reworkOperator,
            duration: reworkResults.reworkDuration, 
            manPower: reworkResults.reworkManPower,
            reworkShift: reworkResults.reworkShift,
            reworkStation: reworkResults.reworkStation,
            note: reworkResults.reworkNote,
            reworkStatus: reworkResults.reworkStatus === 'COMPLETED' ? ReworkStatus.COMPLETED : ReworkStatus.IN_PROGRESS,
            reworkActions: reworkResults.reworkActionsId|| [],
            dismantledMaterials: reworkResults.nokDismantleMaterials ? convertDismanltedMaterial(reworkResults.nokDismantleMaterials) : [],
            }
            console.log('* Nok Rework Form * newFormValue ->', newFormValue);
    
            setFormValues(newFormValue);
            console.log('$$$$ Nok Rework Form * form value * effect ->', formValues);
            setConfirmation({ chooseReworks: (reworkResults.reworkActionsId && reworkResults.reworkActionsId.length > 0 || false), dismantledMaterials: true });
        }
        getInitData();
      },[nokId]);

  // get Station List
  const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
  const stationList: Station[] = stationResults.data || [];

  // Get Work Shift List
  const workShiftResults = useQuery('workShifts', workShiftServices.getShift, { refetchOnWindowFocus: false });
  const workShiftList: WorkShift[] = workShiftResults.data || [];

  // handle Changes
  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active'  ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleAutoCompeletChange = (parameter: string, newValue: | Station | WorkShift) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };

  //  Handle Status Change
  const handleStatusChange = (status: ReworkStatus) => {

    setFormValues({ ...formValues, reworkStatus: status });     
  };

  // Handle Select Rework
  const handleSelectRework = (reworks: Rework[]) => {

    console.log('Nok Rework Form * handleSelectRework * reworks ->', reworks);
    
    let affectedMaterials : AffectedMaterial[] = [];
    let affectedReciepies : number[] = [];
    const newNokReworks = reworks.map(rework => {
      rework.affectedRecipes ? affectedReciepies = affectedReciepies.concat(rework.affectedRecipes) : null;
      if (rework.rwDismantledMaterials) {
        rework.rwDismantledMaterials.map(rwDisMaterial => {
          const newMaterial : AffectedMaterial = {
            rwDismantledMaterialId  : rwDisMaterial.id,
            recipeBomId: rwDisMaterial.recipeBom.id,
            material: rwDisMaterial.recipeBom.material,
            recipeQty: rwDisMaterial.recipeBom.qty,
            suggestedDismantledQty: rwDisMaterial.dismantledQty,
            mandatoryRemove: rwDisMaterial.mandatoryRemove,
            reusable: rwDisMaterial.recipeBom.reusable,
            rwNote: rwDisMaterial.note,
            recipeCode: rwDisMaterial.recipeBom.recipe.recipeCode,

          };
          affectedMaterials.push(newMaterial);
        });
      }
      return (rework.id);
    });
    setFormValues({ ...formValues, reworkActions: newNokReworks, affectedRecipes: [... new Set(affectedReciepies)] });
    setAffectedMaterial(affectedMaterials);
    setConfirmation({ ...confirmation, chooseReworks: true });
  };


  const handleDismantledMaterial = (dismantledMaterials : DismantledMaterialData[]) => {

    console.log(' here ***********');
    
    console.log('Nok Rework Form * handleDismantledMaterial * dismantledMaterials ->', dismantledMaterials);
    
    setFormValues({ ...formValues, dismantledMaterials: dismantledMaterials });
    setConfirmation({ ...confirmation, dismantledMaterials: true });
  };

  // set confirmation
  const handleConfirmChange = (form: string, value: boolean) => {
    const newConfirmation = { ...confirmation, [form]: value };
    setConfirmation(newConfirmation);
  };

  // enable Submit Button
  let disableSubmmit : boolean = true;
  if (formType === 'ADD') {
    disableSubmmit = (!confirmation.chooseReworks || !confirmation.dismantledMaterials );
  }
  else {
    if (formType === 'EDIT') {
      disableSubmmit = false;
    }
  }
  const handleSaveRework = () => {
    //
    if (!formValues.reworkShift) {
      alert('Please select Shift');
      return;
    }
    if (!formValues.reworkStatus) {
      alert('Please select Rework Status' + '\n' +'Does it need more rework or rework is complete?');
      return;
    }
    const newNokReworks : NewNokReworkData = {
      nokId: nokId,
      id: formValues.id,
      reworkActionsId: formValues.reworkActions,
      nokDismantleMaterials: formValues.dismantledMaterials,
      affectedRecipes: formValues.affectedRecipes ? formValues.affectedRecipes : [],
      reworkShift: formValues.reworkShift.id,
      reworkStation: formValues.reworkStation?.id,
      reworkOperator: formValues.operator,
      reworkDuration: formValues.duration,
      reworkManPower: formValues.manPower,
      reworkNote: formValues.note,
      reworkStatus: formValues.reworkStatus 
    };

    nokReworkServices.createNokRework(newNokReworks);
    removeNok(null);
  };


  if (!nok) {
    return(
      <div>
        loading ....
      </div>
    );
  }

  return (
    <Grid container direction={'column'}>
      <Grid container direction={'row'}>
        <Grid item xs={8} sx={{ background: '#9FEAF7' }}>
          <NOK_Info nokId={nokId} />
        </Grid>
        <Stack direction={'row'}>
          <Stack direction={'column'} width={'60%'} >
            <Stack direction={'row'}>
              <TextField
                id='operator'
                name='operator'
                label='Operator'
                disabled={formType === 'VIEW'}
                sx={{ marginLeft: 1, marginTop: 1, width: '15%', minWidth: '150px' }}
                value={formValues.operator}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                size='small'
                required />
              <TextField
                id='duration'
                name='duration'
                label='Duration'
                disabled={formType === 'VIEW'}
                sx={{ marginLeft: 1, marginTop: 1, width: '10%', minWidth: '100px' }}
                value={formValues.duration}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small' />
              <TextField
                id='manPower'
                name='manPower'
                label='Man Power'
                disabled={formType === 'VIEW'}
                sx={{ marginLeft: 1, marginTop: 1, width: '10%', minWidth: '120px' }}
                value={formValues.manPower}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                fullWidth
                size='small' />
              <Autocomplete
                id='reworkShift'
                sx={{ marginLeft: 1, marginTop: 1, width: '12%', minWidth: '140px' }}
                size='small'
                aria-required
                disabled={formType === 'VIEW'}
                clearIcon={false}
                options={workShiftList}
                isOptionEqualToValue={(option: WorkShift, value: WorkShift) => option.shiftName === value.shiftName}
                value={formValues.reworkShift ? formValues.reworkShift : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('reworkShift', newValue)}
                getOptionLabel={(option: { shiftName: string; }) => option.shiftName}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='Shift'
                    placeholder='Shift'
                    size='small'
                    required />
                )} />
              <Autocomplete
                id='reworkStation'
                sx={{ marginLeft: 1, marginTop: 1, width: '15%', minWidth: '190px' }}
                size='small'
                aria-required
                disabled={!(formType === 'ADD')}
                clearIcon={false}
                options={stationList}
                isOptionEqualToValue={(option: Station, value: Station) => option.stationName === value.stationName}
                value={formValues.reworkStation ? formValues.reworkStation : null}
                onChange={(_event, newValue) => newValue && handleAutoCompeletChange('reworkStation', newValue)}
                getOptionLabel={(option: { stationName: string; }) => option.stationName}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
                  <TextField
                    {...params}
                    label='Station'
                    placeholder='Add Station'
                    size='small'
                  />
                )} />
            </Stack>
            <Grid >
              <TextField
                id='note'
                name='note'
                label='Note'
                disabled={formType === 'VIEW'}
                sx={{ marginLeft: 1, marginTop: 1, width: '98%' }}
                value={formValues.note}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                multiline
                size='small' />
            </Grid>
          </Stack>
          <Grid item marginLeft={2}  >
            <RadioGroup
              value={formValues.reworkStatus}
              onChange={(_event, value) => handleStatusChange(value as ReworkStatus)}
              aria-required
            >
              <FormControlLabel value={ReworkStatus.IN_PROGRESS} checked={formValues.reworkStatus === 'IN_PROGRESS'} control={<Radio />} label='More Reworks is needed' />
              <FormControlLabel value={ReworkStatus.COMPLETED} checked={formValues.reworkStatus === 'COMPLETED'} control={<Radio />} label='Reworks are completed' />
            </RadioGroup>
          </Grid>
          <Grid item >
            <Stack marginLeft={0} marginTop={1} spacing={2}>
              <Button
                variant='contained'
                color='primary'
                sx={{ height: '30px', width: '60px' }}
                onClick={() => removeNok(null)}
              > Back
              </Button>
              <Button
                variant='contained'
                disabled={disableSubmmit}
                color='primary'
                sx={{ height: '30px', width: '60px' }}
                onClick={handleSaveRework}
              > Save
              </Button>
            </Stack>
          </Grid>
        </Stack>

      </Grid>
      <Grid container direction={'row'} spacing={1} marginTop={1}>
        <Grid item xs={5}>
          <ReworkChooseList productId={nok.product.id} selectedReworks={formValues.reworkActions || []} confirmSelection={handleSelectRework} confirmChange={(value) => handleConfirmChange('chooseReworks', value)} editable={true} />
        </Grid>
        <Grid item xs={7}>
          <NokDismantledMaterialForm affectedMaterials={affectedMaterials} nokDismantledMaterials={formValues.dismantledMaterials} confirmSelection={handleDismantledMaterial} confirmChange={(value: boolean) => handleConfirmChange('dismantledMaterials', value)} editable={true} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NokReworkForm;