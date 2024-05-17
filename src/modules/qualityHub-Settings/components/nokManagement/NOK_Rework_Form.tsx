import {
  Button,
  Divider,
  Grid,
  Stack,
} from '@mui/material';

import { NokCode, Station, WorkShift, NokAnalyseData, NewNokAnalyseData, NokData, DismantledMaterial, Rework, RwDismantledMaterial } from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import nokDetectServices from '../../services/nokDetectServices';
import NOK_Info from './NOK_Info';
import ReworkChooseList from './ReworkChooseList';
import NokDismantledMaterial from './NOK_DismantleMaterial';

type NokFromProps = {
  nokId: number,
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokAnalyseData?: NokAnalyseData | NewNokAnalyseData  | null;
  removeNok: (nok: null) => void;
}

type FormData = {
  nokCode: NokCode | null;
  causeStation: Station | null;
  causeShift: WorkShift | null;
  description: string;
  timeWaste?: number;
  materialCost?: number;
  closed: boolean;
  nokRework?: number[];
  dismantledMaterials?: DismantledMaterial[];
}

const NokReworkForm = ({ nokId, nokAnalyseData, formType, removeNok }: NokFromProps) => {

  const initFormValues: FormData = {
    nokCode: nokAnalyseData?.nokCode ? nokAnalyseData.nokCode : null,
    causeStation: nokAnalyseData?.causeStation ? nokAnalyseData.causeStation : null,
    causeShift: nokAnalyseData?.causeShift ? nokAnalyseData.causeShift : null,
    description: nokAnalyseData ? nokAnalyseData.description : '',
    closed: nokAnalyseData ? nokAnalyseData.closed : false,
    nokRework: [],
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ nok, setNok ] = useState<NokData | null>(null);
  const [ dismantledMaterials, setDismantledMaterial ] = useState<RwDismantledMaterial[] | never[]>([]);
  const [ confirmation, setConfirmation ] = useState<{chooseReworks: boolean, dismantledMaterials: boolean}>({ chooseReworks: false, dismantledMaterials: false });

  useEffect(() => {
    setFormValues(initFormValues);
    const getNokData = async () => {
      const result = await nokDetectServices.getNokDetectById(nokId);
      setNok(result);
    };
    getNokData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formType]);

  // Handle Select Rework
  const handleSelectRework = (reworks: Rework[]) => {
    let dismantledMaterials : RwDismantledMaterial[] = [];
    const newNokReworks = reworks.map(rework => {
      rework.rwDismantledMaterials ? dismantledMaterials = dismantledMaterials.concat(rework.rwDismantledMaterials) : null;
      return (rework.id);
    });
    setFormValues({ ...formValues, nokRework: newNokReworks });
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
      </Grid>
      <Divider sx={{ margin:1 }}/>
      <ReworkChooseList productId={nok.product.id} selectedReworks={[]} confirmSelection={handleSelectRework} confirmChange={(value) => handleConfirmChange('chooseReworks', value)} editable={true} />
      <Divider sx={{ margin:1 }}/>
      <NokDismantledMaterial affectedMaterials={dismantledMaterials} confirmSelection={handleDismantledMaterial} confirmChange={(value) => handleConfirmChange('dismantledMaterials', value)} editable={true} />
    </Grid>
  );
};

export default NokReworkForm;