import React from 'react'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Grid, Stack } from '@mui/material'

import HomeIcon from '@mui/icons-material/Home'

import { UserBase } from '../../../types/UserAuthTypes'


const pages = ['Config', 'User Management', 'Dashboard']
const settings = ['Profile', 'Account', 'Logout']

const Navigation = ({ signedUser } :{ signedUser: UserBase | null}) => {

  //const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  //const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
  //  setAnchorElNav(event.currentTarget);
  //};

  /*
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
*/

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position='sticky'>
      <Toolbar disableGutters>
        <Grid container justifyContent='space-between'>
          <Grid item>
            <Stack direction={'row'} spacing={5}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href= 'home'
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <HomeIcon sx={{ mr: 1 }} />
                Home
              </Typography>
              {pages.map((page) => (
                <Typography
                  key={page}
                  variant="h6"
                  noWrap
                  component="a"
                  href= {`${page}`}
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {page}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid item marginLeft={25}>
            <Box sx={{ flexGrow: 0 }}>
              {signedUser ?
                <><Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href='home'
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {signedUser.firstName}
                </Typography><Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{settings}</Typography>
                    </MenuItem>
                  ))}
                </Menu></>:

                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href= 'signin'
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                Sign In
                </Typography>
              }
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
export default Navigation