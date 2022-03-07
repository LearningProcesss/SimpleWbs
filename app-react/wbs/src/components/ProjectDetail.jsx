import { Divider, Skeleton, Stack, Typography, Input, IconButton } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import CreateDocument from './CreateDocument';

const ListAsync = lazy(() => import('./List'));
const DocumentCardAsync = lazy(() => import('./DocumentCard'));
const CreateProjectAsync = lazy(() => import('./CreateProject'));


export default function ProjectDetail() {
    const { projectId } = useParams();

    const { isLoading, isError, data, error } = useQuery([`project_${projectId}`], () =>
        fetch(`http://127.0.0.1:5000/api/v1/projects/${projectId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json()),
        
    );

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

    const { createOn, name, users, documents } = data;

    function skeletonList() {
        // return Array.from(Array(10).keys(), (n) => (
        //     <div style={{ margin: "1rem" }}>
        //         <Skeleton variant="rectangular" width={100} height={100} />
        //     </div>
        // ))
        return <div></div>
    }

    return (
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <WorkIcon />
                <Typography variant="h3">{name}</Typography>
            </div>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
                <Typography sx={{ mt: 1, mb: 1 }} variant="button">Documents {documents && documents.length}</Typography>
                <Suspense fallback={<Skeleton variant="rectangular" width={100} height={100} />}>
                    <CreateDocument entityFatherId={projectId} />
                </Suspense>
            </div>
            <Divider sx={{ width: '100%' }} />
            <Suspense fallback={skeletonList()}>
                <ListAsync style={{ marginTop: "1rem" }} headerText={""} datalist={documents ? documents : []} renderDataItem={(item, index) => (
                    <DocumentCardAsync key={item} itemId={item} fatherId={projectId} />
                )}>
                </ListAsync>
            </Suspense>
        </div>
    )
}
