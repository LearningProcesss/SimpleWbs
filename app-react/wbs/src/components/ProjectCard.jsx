import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Badge, Card, CardActions, CardContent, Fab, Skeleton, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from "react-router-dom";
import EditProject from './EditProject';

export default function ProjectCard({ children, styles, itemId }) {

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { isLoading, isError, data, error } = useQuery(`project_${itemId}`, () =>
        fetch(`http://127.0.0.1:5000/api/v1/projects/${itemId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    const deleteProject = useMutation(projectId => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects/${projectId}`, {
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
        deleteProject.mutate(itemId);
    }, []);

    const onCardClickHandler = useCallback(() => {
        navigate(`/projects/${itemId}`);
    });

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

    const { clientId, createOn, name, vat, users, documents } = data;

    return (
        <Card sx={{ display: 'flex', justifyContent: "space-between",maxWidth: { xs: '100%', sm: '100%', md: '130rem', lg: '100%', xl: '100%' } }}>
            <CardContent>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="overline">{createOn}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', marginTop: '1rem' }}>
                    <Badge badgeContent={users != null ? users.length : 0} color="success">
                        <PersonIcon color="action" />
                    </Badge>
                    <Badge badgeContent={documents != null ? documents.length : 0} color="success">
                        <InsertDriveFileIcon color="action" />
                    </Badge>
                </div>
            </CardContent>
            <CardActions>
                <Stack style={{ margin: "1rem" }} direction="row" spacing={1}>
                    <EditProject entity={data} />
                    <Fab color="error" aria-label="delete" onClick={onDeleteClickHandler} disabled={deleteProject.isLoading}>
                        <DeleteIcon />
                    </Fab>
                    <Fab color="success" aria-label="detail" onClick={onCardClickHandler} disabled={deleteProject.isLoading}>
                        <ArrowForwardIcon />
                    </Fab>
                </Stack>
            </CardActions>
        </Card>
    )
}
