import React, { Suspense } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Routes, Router, Route, Link, useNavigate, Outlet } from "react-router-dom";


// const Client = React.lazy(() => import("./Client"));

export default function Home() {
    let navigate = useNavigate();
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
                                // onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Projects
                            </Button>
                            <Button
                                key={"users"}
                                // onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Users
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet />
        </React.Fragment>
    )
}
