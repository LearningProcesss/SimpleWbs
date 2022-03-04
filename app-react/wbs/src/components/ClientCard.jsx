import React, { useCallback } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import { Card, CardActions, Badge, CardHeader, Box, Button, Skeleton, Stack, IconButton, Fab, CardContent, Typography } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import EditClient from './EditClient';

export default function ClientCard({ children, styles, itemId }) {

    const queryClient = useQueryClient();

    // console.log("ClientCard-itemId", itemId);

    const { isLoading, isError, data, error } = useQuery(`client_${itemId}`, () =>
        fetch(`http://127.0.0.1:5000/api/v1/clients/${itemId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    const deleteClient = useMutation(clientId => {
        return fetch(`http://127.0.0.1:5000/api/v1/clients/${clientId}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });

    const onDeleteClickHandler = useCallback(() => {
        deleteClient.mutate(itemId);
    }, []);

    if (!itemId) {
        return null;
    }

    if (isLoading) {
        return (
            <Stack spacing={1}>
                <Skeleton variant="text" />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={118} />
            </Stack>
        )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const { clientId, createOn, name, vat, users, projects } = data;

    return (
        <Card sx={{ display: 'flex' }}>
            <CardContent sx={{ minWidth: 500 }}>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="overline">{createOn}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', marginTop: '1rem' }}>
                    <Badge badgeContent={users != null ? users.length : 0} color="success">
                        <PersonIcon color="action" />
                    </Badge>
                    <Badge badgeContent={projects != null ? projects.length : 0} color="success">
                        <WorkIcon color="action" />
                    </Badge>
                </div>
            </CardContent>
            <CardActions>
                <Stack style={{ margin: "1rem" }} direction="row" spacing={1}>
                    {/* <Fab color="warning" aria-label="add">
                        <ModeEditOutlineIcon />
                    </Fab> */}
                    <EditClient clientObject={data}/>
                    <Fab color="error" aria-label="delete" onClick={onDeleteClickHandler} disabled={deleteClient.isLoading}>
                        <DeleteIcon />
                    </Fab>
                </Stack>
            </CardActions>
        </Card>
    )
}
