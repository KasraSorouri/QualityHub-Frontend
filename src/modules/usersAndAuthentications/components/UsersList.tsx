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
  Grid
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EditIcon from '@mui/icons-material/Edit';

//import { useNotificationSet } from '../../../contexts/NotificationContext';
import { UserBase } from '../../../types/UserAuthTypes';

type UserListProps = {
  users: UserBase[];
  allUsers: number;
  displayUserForm: ({ show, formType }:{show: boolean, formType: 'ADD' | 'EDIT'}) => void;
  selectUser: (userData: UserBase | null) => void;
}

interface EnhancedTableHeadProps {
  order: 'asc' | 'desc';
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

const UsersList = ({ users, allUsers,  displayUserForm, selectUser }: UserListProps) : JSX.Element => {

  //const setNotification = useNotificationSet();

  // Sort Items
  const [ sort, setSort ] = useState<{ sortItem: keyof UserBase; sortOrder: number }>({ sortItem: 'lastName' , sortOrder: 1 });
  const order : 'asc' | 'desc' = sort.sortOrder === 1 ? 'asc' : 'desc';
  const orderBy : keyof UserBase = sort.sortItem;

  const sortedUsers: UserBase[]  = users.sort((a, b) => {
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

  const showEditUser = (id : string) => {
    const userData: UserBase = users.filter((u) => u.id === id )[0];
    selectUser(userData);
    displayUserForm({ show: true, formType: 'EDIT' });
  };

  const addNewUser = () => {
    selectUser(null);
    displayUserForm({ show: true, formType: 'ADD' });
  };

  const columnHeader = [
    { id: 'lastName', lable: 'Last Name', minWidth: 10  },
    { id: 'firstName', lable: 'First Name', minWidth: 10 },
    { id: 'username', lable: 'Username', minWidth: 5 },
    { id: 'active', lable: 'Active', minWidth: 5 },
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
              style={{ minWidth: column.minWidth }}
              sx={{ backgroundColor: '#1976d2', color: 'white' }}
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

  const handleRequestSort = (_event: undefined, property: keyof UserBase) => {
    const isAsc = orderBy === property && order ==='asc';
    setSort({ sortItem: property, sortOrder:isAsc ? -1 : 1 });
  };

  /*
  if (!users){
    return (
      setNotification({ message: 'No User find!', type: 'info', time: 8 })
    );
  }
*/
  return(
    <div>
      <Paper>
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'} >
          <Typography margin={1} >USER LIST</Typography>
          <Typography margin={1} >{users.length} of {allUsers} users</Typography>
          <div style={{ margin: '10px' }} >
            <IconButton onClick={addNewUser} style={{ height: '16px', width: '16px', color:'white' }}>
              <PersonAddAlt1Icon />
            </IconButton>
          </div>
        </Grid>
        <TableContainer sx={{ maxHeight: '550Px' }}>
          <Table stickyHeader aria-label='sticky table' size='small'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={() => handleRequestSort}
            />
            <TableBody>
              { sortedUsers.map((user) => {
                return(
                  <TableRow hover role='checkbox' tabIndex={-1} key={user.id} >
                    <TableCell align='left' >
                      {user.lastName}
                    </TableCell>
                    <TableCell align='left' >
                      {user.firstName}
                    </TableCell>
                    <TableCell align='left' >
                      {user.username}
                    </TableCell>
                    <TableCell align='center' >
                      <Box justifyContent={'space-between'} >
                        <Checkbox checked={user.active} style={{ height: '16px', width: '16px' }}/>
                        <IconButton onClick={() => showEditUser(user.id)} style={{ height: '12px', width: '12px', marginLeft: 25 , color:'#1976d2d9' }}>
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
    </div>
  );
};

export default UsersList;