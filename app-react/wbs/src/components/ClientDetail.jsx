import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";

const ListAsync = lazy(() => import('./List'));
const ProjectCardAsync = lazy(() => import('./ProjectCard'));
const CreateProjectAsync = lazy(() => import('./CreateProject'));


export default function ClientDetail() {
    const { clientId } = useParams();

    const { isLoading, isError, data, error } = useQuery(`client_${clientId}`, () =>
        fetch(`http://127.0.0.1:5000/api/v1/clients/${clientId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    if (isLoading) {
        // return (
        //     <Stack spacing={1}>
        //         <Skeleton variant="text" />
        //         <Skeleton variant="circular" width={40} height={40} />
        //         <Skeleton variant="rectangular" width={210} height={118} />
        //     </Stack>
        // )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const { createOn, name, vat, users, projects } = data;

    function skeletonList() {
        // return Array.from(Array(10).keys(), (n) => (
        //     <div style={{ margin: "1rem" }}>
        //         <Skeleton variant="rectangular" width={250} height={300} />
        //     </div>
        // ))
        return <div></div>
    }

    return (
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <CorporateFareIcon />
                <Typography variant="h3">{name}</Typography>
            </div>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
                <Typography sx={{ mt: 1, mb: 1 }} variant="button">Progetti {projects && projects.length}</Typography>
                <Suspense fallback={<Skeleton variant="rectangular" width={100} height={100} />}>
                    <CreateProjectAsync entityFatherId={clientId} />
                </Suspense>
            </div>
            <Divider sx={{ width: '100%' }} />
            <Suspense fallback={skeletonList()}>
                <ListAsync style={{ marginTop: "1rem" }} headerText={""} datalist={projects ? projects : []} renderDataItem={(item, index) => (
                    <ProjectCardAsync key={item} itemId={item} />
                )}>
                </ListAsync>
            </Suspense>
        </div>
    )
}
