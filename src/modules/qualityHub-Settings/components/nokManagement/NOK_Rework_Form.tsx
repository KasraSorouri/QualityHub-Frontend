import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  Autocomplete,
  Button,
  FilledTextFieldProps,
  Grid,
  OutlinedTextFieldProps,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material';

import { Station, WorkShift, NokAnalyseData, NewNokAnalyseData, NokData, DismantledMaterial, Rework, RwDismantledMaterial, NewNokReworkData, ReworkStatus } from '../../../../types/QualityHubTypes';
import nokDetectServices from '../../services/nokDetectServices';
import NOK_Info from './NOK_Info';
import ReworkChooseList from './ReworkChooseList';
import NokDismantledMaterial from './NOK_DismantleMaterial';
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
  materialCost?: number;
  operator: string;
  duration?: number | string;
  manPower?: number | string;
  reworkShift?: WorkShift | undefined;
  reworkStation: Station | undefined;
  reworkActions?: number[];
  affectedRecipes?: number[],
  dismantledMaterials?: DismantledMaterial[];
  note?: string;
}

const NokReworkForm = ({ nokId, formType, removeNok }: NokFromProps) => {

  const initFormValues: FormData = {
    operator: '',
    duration: '',
    manPower: '',
    reworkShift: undefined,
    reworkStation: undefined,
    note: ''
    //nokRework: [],
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ nok, setNok ] = useState<NokData | null>(null);
  const [ dismantledMaterials, setDismantledMaterial ] = useState<RwDismantledMaterial[] | never[]>([]);
  const [ confirmation, setConfirmation ] = useState<{chooseReworks: boolean, dismantledMaterials: boolean}>({ chooseReworks: false, dismantledMaterials: false });

  console.log('Nok Rework fprm ** dismantledMaterials -> ',dismantledMaterials);
  console.log('Nok Rework fprm ** formValues -> ',formValues);

  useEffect(() => {
    setFormValues(initFormValues);
    const getNokData = async () => {
      const result = await nokDetectServices.getNokDetectById(nokId);
      setNok(result);
    };
    getNokData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formType]);

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

  // Handle Select Rework
  const handleSelectRework = (reworks: Rework[]) => {
    let dismantledMaterials : RwDismantledMaterial[] = [];
    const newNokReworks = reworks.map(rework => {
      rework.rwDismantledMaterials ? dismantledMaterials = dismantledMaterials.concat(rework.rwDismantledMaterials) : null;
      return (rework.id);
    });
    setFormValues({ ...formValues, reworkActions: newNokReworks });
    setDismantledMaterial(dismantledMaterials);
    setConfirmation({ ...confirmation, chooseReworks: true });
  };


  const handleDismantledMaterial = (dismantledMaterials : DismantledMaterial[]) => {
    // Calculate Material Cost
    const materialCost = dismantledMaterials.reduce((totalCost, item) => {
      const cost = item.material.price ? item.actualDismantledQty * item.material.price : 0;
      return totalCost + cost;
    }, 0);
    setFormValues({ ...formValues, dismantledMaterials: dismantledMaterials, materialCost: materialCost });
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
    if (!formValues.reworkShift || 0>1 ) {
      alert('Please select Shift');
      return;
    }
    const newNokReworks : NewNokReworkData = {
      nokId: nokId,
      reworkActions: formValues.reworkActions,
      dismantledMaterials: formValues.dismantledMaterials,
      affectedRecipes: formValues.affectedRecipes ? formValues.affectedRecipes : [],
      reworkShift: formValues.reworkShift.id,
      reworkStation: formValues.reworkStation?.id,
      reworkOperator: formValues.operator,
      reworkDuration: formValues.duration,
      reworkManPower: formValues.manPower,
      reworkNote: formValues.note,
      reworkStatus: ReworkStatus.COMPLETED
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
        <Grid item xs={8}>
          <NOK_Info nokId={nokId} />
        </Grid>
        <Grid item xs={4}>
          <Stack marginLeft={2} spacing={2}>
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
        <Grid container>
          <TextField
            id='operator'
            name='operator'
            label='Operator'
            disabled={formType === 'VIEW'}
            sx={{ marginLeft: 2, marginTop: 1, width: '20%', minWidth: '180px' }}
            value={formValues.operator}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            size='small'
            required
          />
          <TextField
            id='duration'
            name='duration'
            label='Duration'
            sx={{ marginLeft: 2, marginTop: 1 , width:'7%', minWidth: '40px' }}
            value={formValues.duration}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            fullWidth
            size='small'
          />
          <TextField
            id='manPower'
            name='manPower'
            label='Man Power'
            sx={{ marginLeft: 2, marginTop: 1 , width:'7%', minWidth: '40px' }}
            value={formValues.manPower}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            fullWidth
            size='small'
          />
          <Autocomplete
            id='reworkShift'
            sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth:'140px' }}
            size='small'
            aria-required
            disabled={formType === 'VIEW'}
            options={workShiftList}
            isOptionEqualToValue={
              (option: WorkShift, value: WorkShift) => option.shiftName === value.shiftName
            }
            value={formValues.reworkShift ? formValues.reworkShift : null}
            onChange={(_event, newValue) => newValue && handleAutoCompeletChange('reworkShift', newValue)}
            getOptionLabel={(option: { shiftName: string; }) => option.shiftName}
            renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
              <TextField
                {...params}
                label='Shift'
                placeholder='Shift'
                size='small'
                required
              />
            )}
          />
          <Autocomplete
            id='reworkStation'
            sx={{ marginLeft: 2, marginTop: 1, width: '18%', minWidth: '200px' }}
            size='small'
            aria-required
            disabled={!(formType === 'ADD')}
            options={stationList}
            isOptionEqualToValue={
              (option: Station, value: Station) => option.stationName === value.stationName
            }
            value={formValues.reworkStation ? formValues.reworkStation : null}
            onChange={(_event, newValue) => newValue && handleAutoCompeletChange('reworkStation', newValue)}
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
          <TextField
            id='note'
            name='note'
            label='Note'
            disabled={formType === 'VIEW'}
            sx={{ marginLeft: 2, marginTop: 1 , width:'85%' }}
            value={formValues.note}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
            fullWidth
            size='small'
          />
        </Grid>
      </Grid>
      <Grid container direction={'row'} spacing={1} marginTop={1}>
        <Grid item xs={5}>
          <ReworkChooseList productId={nok.product.id} selectedReworks={[]} confirmSelection={handleSelectRework} confirmChange={(value) => handleConfirmChange('chooseReworks', value)} editable={true} />
        </Grid>
        <Grid item xs={7} >
          <NokDismantledMaterial affectedMaterials={dismantledMaterials} confirmSelection={handleDismantledMaterial} confirmChange={(value) => handleConfirmChange('dismantledMaterials', value)} editable={true} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NokReworkForm;