import { useState } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  Box,
  TableRow,
  Checkbox,
  Typography,
  Grid,
  Button,
  Collapse,
  Stack
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import { Recipe } from '../../../../types/QualityHubTypes';
import RecipeBOM from '../recipe/RecipeBOM';
import React from 'react';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Recipe;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RecipeListProps = {
  recipes: Recipe[];
  confirmSelection: (recipes : number[]) => void;
}

type ShowDetails = {
  show: boolean;
  index: number | undefined;
}

const ReworkRecipeList = ({ recipes, confirmSelection } : RecipeListProps) => {

  const [ selectedRwRecipes, setSelectedRwRecipes ] = useState<number[]>([]);

  const [ showMatrials, setShowMaterials ] = useState<ShowDetails>({ index: undefined, show: false });

  console.log('** Rework Recipe list * selected recipes ->', selectedRwRecipes);

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof Recipe; sortOrder: number }>({ sortItem: 'recipeCode' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof Recipe = sort.sortItem;

  const sortedRecipes: Recipe[]  = recipes.sort((a, b) => {
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
    { id: 'recipeCode', lable: 'Code', with: '10%', minWidth: 10, borderRight: true },
    { id: 'description', lable: 'Description', with: '20%', minWidth: 10, borderRight: true },
    { id: 'station', lable: 'Station', with: '20%', minWidth: 10, borderRight: true },
    { id: 'order', lable: 'order', with: '10%', minWidth: 10, borderRight: true },
    { id: 'timeDuration', lable: 'Duration', with: '10%', minWidth: 10, borderRight: true },
    { id: 'manpower', lable: 'Manpower', with: '10%', minWidth: 10, borderRight: true },
    { id: 'recipeType', lable: 'Type', with: '10%', minWidth: 10, borderRight: true },
    { id: 'materials', lable: 'Materials', with: '10%', width: 164, borderRight: true },
    { id: 'active', lable: 'Active', width: 2 },
  ];

  const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = ({
    order,
    orderBy,
    onRequestSort,
  }) => {
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell
            key={'select'}
            align='right'
            style={{ width: 40 }}
            sx={{ backgroundColor: '#B7FFB3', color: 'white' }}
          />
          {columnHeader.map((column) => (
            <TableCell
              key={column.id}
              align='center'
              style={{ width: column.width ? column.width : undefined, minWidth: column.minWidth }}
              sx={{ backgroundColor: '#1976d2', color: 'white' , borderRight: column.borderRight ? '1px solid white' : undefined }}
              sortDirection={orderBy === column.id ? order : false }
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc' }
                onClick={createSortHandler(column.id)}
              >
                {column.lable}
                {orderBy === column.id ? (
                  <Box  sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Recipe) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };


  const handleSelect = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = id;
    if (selectedRwRecipes.includes(selectedIndex)){
      const newSelected = selectedRwRecipes.filter((id) => id !== selectedIndex);
      setSelectedRwRecipes(newSelected);
    } else {
      const newSelected = selectedRwRecipes.concat(selectedIndex);
      setSelectedRwRecipes(newSelected);
    }
  };

  const isSelected = (id: number) => selectedRwRecipes.indexOf(id) !== -1;


  const handleConfirmSelection = () => {
    confirmSelection(selectedRwRecipes);
  };

  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} > REWORK RECIPES</Typography>
        <Typography margin={1} >{selectedRwRecipes.length} Recipes is Selected</Typography>
        <Stack direction={'row'} spacing={1} margin={.5} >
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={() => setSelectedRwRecipes([])} >
            Clear Selection
          </Button>
          <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleConfirmSelection} >
            Confirm
          </Button>
        </Stack>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Recipe)}
          />
          <TableBody>
            { sortedRecipes.map((recipe, index) => {
              const isItemSelected = isSelected(recipe.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return(
                <React.Fragment key={recipe.id}>
                  <TableRow
                    hover
                    onClick={(event) => handleSelect(event, recipe.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={recipe.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {recipe.recipeCode}
                    </TableCell>
                    <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                      {recipe.description}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {recipe.station.stationName}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {recipe.order}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {recipe.timeDuration}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      {recipe.manpower}
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      <span style={{
                        backgroundColor: recipe.recipeType === 'PRODUCTION' ? '#96FFD9' : '#56F0FA',
                        padding: '5px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }} >
                        {recipe.recipeType}
                      </span>
                    </TableCell>
                    <TableCell align='center' sx={{ borderRight: '1px solid gray' }} >
                      <Button onClick={() => setShowMaterials({ index, show:!showMatrials.show })} variant='contained' color='primary'>
                        {showMatrials.show && showMatrials.index === index ? 'Hide' : 'Show'} Materials
                      </Button>
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        <Checkbox checked={recipe.active} style={{ height: '16px', width: '16px' }}/>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow key={index}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={showMatrials.show && showMatrials.index === index} timeout='auto' unmountOnExit>
                        <Box margin={1}>
                          <RecipeBOM bom={recipe.recipeMaterials ? recipe.recipeMaterials : []} updateBOM={() => null} readonly={true} />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReworkRecipeList;