import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from '../hooks/authcontext';

export default function Home() {

    const { logout } = useAuthContext();

    let navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Wbs
                        </Typography>
                        <Box sx={{ flexGrow: 1, gap: 5, display: { xs: 'none', md: 'flex' } }}>

                            <Button
                                key={"clients"}
                                onClick={() => navigate("/clients")}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Clients
                            </Button>
                            <Button
                                key={"projects"}
                                onClick={() => navigate("/projects")}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Projects
                            </Button>
                            <Button
                                key={"users"}
                                onClick={() => navigate("/users")}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Users
                            </Button>
                        </Box>
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={logout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <Outlet />
            </div>
        </React.Fragment>
    )
}
