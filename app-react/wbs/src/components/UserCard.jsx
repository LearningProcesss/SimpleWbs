import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { Badge, Card, CardActions, CardContent, Fab, Skeleton, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from "react-router-dom";
import EditUser from './EditUser';

export default function UserCard({ children, styles, itemId }) {

    console.log(itemId);

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { isLoading, isError, data, error } = useQuery(`user_${itemId}`, () =>
        fetch(`http://127.0.0.1:5000/api/v1/users/${itemId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    const deleteUser = useMutation(userId => {
        return fetch(`http://127.0.0.1:5000/api/v1/users/${userId}`, {
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
        deleteUser.mutate(itemId);
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

    const { userId, createOn, name, surname, email, clients, projects } = data;

    return (
        <Card sx={{ display: 'flex', justifyContent: "space-between" }}>
            <CardContent>
                <Typography variant="h5">{name} {surname} {email}</Typography>
                <Typography variant="overline">{createOn}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', marginTop: '1rem' }}>
                    <Badge badgeContent={clients != null ? clients.length : 0} color="success">
                        <CorporateFareIcon color="action" />
                    </Badge>
                    <Badge badgeContent={projects != null ? projects.length : 0} color="success">
                        <WorkIcon color="action" />
                    </Badge>
                </div>
            </CardContent>
            <CardActions>
                <Stack style={{ margin: "1rem" }} direction="row" spacing={1}>
                    <EditUser entity={data} />
                    <Fab color="error" aria-label="delete" onClick={onDeleteClickHandler} disabled={deleteUser.isLoading}>
                        <DeleteIcon />
                    </Fab>
                    {/* <Fab color="success" aria-label="detail" onClick={onCardClickHandler} disabled={deleteProject.isLoading}>
                        <ArrowForwardIcon />
                    </Fab> */}
                </Stack>
            </CardActions>
        </Card>
    )
}
