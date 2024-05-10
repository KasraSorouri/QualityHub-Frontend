import {
  Divider,
  Grid,
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

const NokReworkForm = ({ nokId, nokAnalyseData, formType }: NokFromProps) => {
  console.log('NOK Rework * nok ID ->', nokId);

  //const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

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

  console.log('NOK Rework * NOK Data ->', nok);
  console.log('NOK Rework * formValues ->', formValues);
  console.log('NOK Rework * dismantledMaterials ->', dismantledMaterials);


  useEffect(() => {
    setFormValues(initFormValues);
    const getNokData = async () => {
      const result = await nokDetectServices.getNokDetectById(nokId);
      setNok(result);
    };
    getNokData();
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
  };


  const handleDismantledMaterial = (dismantledMaterials : DismantledMaterial[]) => {
    // Calculate Material Cost
    const materialCost = dismantledMaterials.reduce((totalCost, item) => {
      const cost = item.material.price ? item.actualDismantledQty * item.material.price : 0;
      return totalCost + cost;
    }, 0);
    console.log(' material cost ->', materialCost);
    setFormValues({ ...formValues, dismantledMaterials: dismantledMaterials, materialCost: materialCost });
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
        test Button
        </Grid>
      </Grid>
      <Divider sx={{ margin:1 }}/>
      <ReworkChooseList productId={nok.product.id} selectedReworks={[]} confirmSelection={handleSelectRework} confirmChange={() => { console.log('confirm change');} } editable={true} />
      <Divider sx={{ margin:1 }}/>
      <NokDismantledMaterial affectedMaterials={dismantledMaterials} confirmSelection={handleDismantledMaterial} confirmChange={() => { console.log('confirm change');} } editable={true} />
    </Grid>
  );
};

export default NokReworkForm;