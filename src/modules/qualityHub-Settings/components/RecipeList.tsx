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
  IconButton,
  Grid,
  Button
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { Recipe } from '../../../types/QualityHubTypes';

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: keyof Recipe;
  onRequestSort: (_event: React.MouseEvent<unknown>, property: string) => void;
}

type RecipeListProps = {
  recipes: Recipe[];
  displayRecipeForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectRecipe: (RecipeData: Recipe | null) => void;
}


const RecipeList = ({ recipes, displayRecipeForm, selectRecipe } : RecipeListProps) => {


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
    { id: 'recipeCode', lable: 'Code', minWidth: 10, borderRight: true },
    { id: 'description', lable: 'Description', minWidth: 10, borderRight: true },
    { id: 'station', lable: 'Station', minWidth: 10, borderRight: true },
    { id: 'order', lable: 'order', minWidth: 10, borderRight: true },
    { id: 'timeDuration', lable: 'Duration', minWidth: 10, borderRight: true },
    { id: 'materials', lable: 'Materials', minWidth: 10, borderRight: true },
    { id: 'active', lable: 'Active', width: 3 },
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

  const showEditRecipe = (id : number | string) => {
    const recipeData: Recipe = recipes.filter((u) => u.id === id )[0];
    selectRecipe(recipeData);
    displayRecipeForm({ show: true, formType: 'EDIT' });
  };

  const addNewRecipe = () => {
    selectRecipe(null);
    displayRecipeForm({ show: true, formType: 'ADD' });
  };


  return(
    <Paper>
      <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
        <Typography margin={1} >RECIPE LIST</Typography>
        <Typography margin={1} >{recipes.length} Recipes</Typography>
        <div style={{ margin: '10px' }} >
          <IconButton onClick={addNewRecipe} style={{ height: '16px', width: '16px', color:'white' }}>
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <TableContainer sx={{ maxHeight: '550Px' }}>
        <Table stickyHeader aria-label='sticky table' size='small'>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={(_event, property) => handleRequestSort(_event, property as keyof Recipe)}
          />
          <TableBody>
            { sortedRecipes.map((recipe) => {
              return(
                <TableRow hover role='checkbox' tabIndex={-1} key={recipe.id} >
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {recipe.recipeCode}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {recipe.description}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {recipe.station.stationName}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {recipe.order}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    {recipe.timeDuration}
                  </TableCell>
                  <TableCell align='left' sx={{ borderRight: '1px solid gray' }} >
                    <Button onClick={() => selectRecipe(recipe)} variant='contained' color='primary'>
                      Materials
                    </Button>
                  </TableCell>
                  <TableCell align='center' >
                    <Box justifyContent={'space-between'} >
                      <Checkbox checked={recipe.active} style={{ height: '16px', width: '16px' }}/>
                      <IconButton onClick={() => showEditRecipe(recipe.id)}
                        title='Edit'
                        style={{ height: '12px', width: '12px', marginLeft: 25 , color:'#1976d2d9' }}>
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecipeList;