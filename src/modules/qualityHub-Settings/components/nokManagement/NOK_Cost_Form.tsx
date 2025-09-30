import { useEffect, useMemo, useState } from 'react';

import { useQuery } from 'react-query';

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import nokCostServices from '../../services/nokCostServices';

import { DismanteledMaterialData, MaterialStatus, NewNokCostData } from '../../../../types/QualityHubTypes';

interface NokCostProps {
  nokId: number;
  formType: 'ADD' | 'EDIT' | 'VIEW';
  readonly: boolean;
}

interface MaterialData {
  materialId: number;
  materialName: string;
  registeredPrice: number;
  dismantledQty: number;
  status: MaterialStatus;
  unitPrice: number;
}

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof MaterialData;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

const NokCostForm = ({ nokId, formType, readonly }: NokCostProps) => {
  console.log('Form prop * nokId -> ', nokId);
  console.log('Form prop * formType -> ', formType);

  const blankMaterialData: MaterialData = {
    materialId: 0,
    materialName: '',
    registeredPrice: 0,
    dismantledQty: 0,
    status: MaterialStatus.SCRAPPED,
    unitPrice: 0,
  };

  const [materialData, setMaterialData] = useState<MaterialData[]>([blankMaterialData]);
  const [sort, setSort] = useState<{ sortItem: keyof MaterialData; sortOrder: number }>({
    sortItem: 'materialName',
    sortOrder: 1,
  });

  // find rework for Nok Id
  //const rework = nokReworkServices.getNokReworkByNokId(nokId);

  const result = useQuery(['NokReworks', nokId], () => nokCostServices.getDismantledMaterialByNokId(nokId), {
    refetchOnWindowFocus: false,
  });

  const materialList: DismanteledMaterialData[] = useMemo(() => result.data || [], [result.data]);

  console.log('Form prop * Material List -> ', materialList);

  useEffect(() => {
    return setMaterialData(
      materialList.map((item) => ({
        materialId: item.material.id,
        materialName: item.material.itemShortName,
        registeredPrice: Number(item.material.price) || 0,
        dismantledQty: item.qty,
        status: item.materialStatus,
        unitPrice: 0,
      })),
    );
  }, [materialList]);
  // Sort Items
  const order: 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy: keyof MaterialData = sort.sortItem;

  const sortedMaterial: MaterialData[] = materialData.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue !== undefined && bValue !== undefined) {
      if (aValue < bValue) {
        return -1 * sort.sortOrder;
      }
      if (aValue > bValue) {
        return 1 * sort.sortOrder;
      }
    }
    return 0;
  });

  const columnHeader = [
    { id: 'material', lable: 'Material', minWidth: 300, borderRight: true },
    { id: 'qty', lable: 'Qty', width: 'auto', borderRight: true },
    { id: 'status', lable: 'Status', width: 'auto', borderRight: true },
    { id: 'registeredPrice', lable: 'Registered Price', width: 'auto', borderRight: true },
    { id: 'price', lable: 'Price', width: 'auto', borderRight: false },
  ];

  const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({ order, orderBy, onRequestSort }) => {
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align="center"
              style={{ width: column.width ? column.width : undefined, minWidth: column.minWidth }}
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                borderRight: column.borderRight ? '1px solid white' : undefined,
              }}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.lable}
                {orderBy === column.id ? (
                  <Box sx={visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof MaterialData) => {
    const isAsc = orderBy === property && order === 'asc';
    setSort({ sortItem: property, sortOrder: isAsc ? -1 : 1 });
  };

  const handleCopyPrice = (): void => {
    const newMaterialData = materialData.map((m) => ({ ...m, unitPrice: m.registeredPrice }));
    setMaterialData(newMaterialData);
  };

  function handleSavePrice(): void {
    const newNokCostData: NewNokCostData = {
      nokId: nokId,
      reworkId: 1,
      dismantledMaterial: materialData,
    };
    nokCostServices.createNokCost(newNokCostData);
  }

  return (
    <Paper>
      <Button variant="contained" sx={{ margin: '10px' }} onClick={() => handleCopyPrice()}>
        {'Registered Price -> Price'}
      </Button>
      {sortedMaterial.reduce((check, material) => check * material.unitPrice, 1) !== 0 && (
        <Button variant="contained" sx={{ margin: '10px' }} onClick={() => handleSavePrice()}>
          Save
        </Button>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          name="totalPrice"
          label="Total Price"
          sx={{ width: '20%', margin: '10px' }}
          value={materialData.reduce((total, material) => total + material.unitPrice * material.dismantledQty, 0)}
          InputProps={{ readOnly: true }}
        />
      </Box>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof MaterialData)}
          />
          <TableBody>
            {sortedMaterial.map((material, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell align="left" sx={{ borderRight: '1px solid gray' }}>
                    {material.materialName}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                    {material.dismantledQty}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderRight: '1px solid gray',
                      backgroundColor:
                        material.status === MaterialStatus.OK
                          ? '#A8F285'
                          : material.status === MaterialStatus.IQC
                            ? '#FFFFAB'
                            : '#F2A8A8',
                    }}
                  >
                    {material.status}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: '1px solid gray' }}>
                    {material.registeredPrice}
                  </TableCell>
                  {!readonly ? (
                    <TableCell align="justify">
                      <TextField
                        name="price"
                        //type='number'
                        sx={{ width: '98%' }}
                        value={material.unitPrice}
                        onChange={(event) => {
                          const newMaterialData = materialData.map((item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                unitPrice: parseInt(event.target.value) || 0,
                              };
                            }
                            return item;
                          });
                          setMaterialData(newMaterialData);
                        }}
                        size="small"
                        required
                      />
                    </TableCell>
                  ) : material.unitPrice !== 0 ? (
                    <TableCell align="justify">{material.unitPrice}</TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default NokCostForm;
