import { Divider, Skeleton, Stack, Typography, Input, IconButton } from '@mui/material';
import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";
import CreateDocument from './CreateDocument';

const ListAsync = lazy(() => import('./List'));
const DocumentCardAsync = lazy(() => import('./DocumentCard'));
const CreateProjectAsync = lazy(() => import('./CreateProject'));


export default function ProjectDetail() {
    const { projectId } = useParams();
    console.log("detail", projectId)

    const { isLoading, isError, data, error } = useQuery(`project_${projectId}`, () =>
        fetch(`http://127.0.0.1:5000/api/v1/projects/${projectId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
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

    console.log('ProjectDetail', data);

    function skeletonList() {
        return Array.from(Array(10).keys(), (n) => (
            <div style={{ margin: "1rem" }}>
                <Skeleton variant="rectangular" width={250} height={300} />
            </div>
        ))
    }

    return (
        <Fragment>
            <Typography variant="h3">{name}</Typography>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignContent: "center" }}>
                <Typography>Projects</Typography>
                <CreateDocument entityFatherId={projectId} />
            </div>
            <Divider style={{}} />
            <Suspense fallback={skeletonList()}>
                <ListAsync key={0} headerText={""} datalist={documents ? documents : []} renderDataItem={(item, index) => (
                    <DocumentCardAsync key={item} itemId={item} />
                )}>
                </ListAsync>
            </Suspense>
        </Fragment>
    )
}
