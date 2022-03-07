import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useAuthContext } from '../hooks/authcontext';
import { Skeleton, Typography, Divider } from '@mui/material';

const ListAsync = lazy(() => import('./List'));
const CreateProjectAsync = lazy(() => import('./CreateProject'));
const ProjectCardAsync = lazy(() => import('./ProjectCard'));

export default function ProjectDashboard() {

    const { userInfo } = useAuthContext();

    const { isLoading, isError, data, error } = useQuery("usersWithProjectsId", () =>
        fetch(`http://127.0.0.1:5000/api/v1/users/${userInfo.userId}/projects`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accesstoken'),
            }
        }).then((res) => res.json())
    );

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "2em" }}>
            </div>
        )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    function skeletonList() {
        return <div></div>
    }

    const { userId, projects } = data;

    console.log(data);

    return (
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <Typography sx={{ color: "" }} variant="h3">Dashboard Progetti</Typography>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
                <Typography sx={{ mt: 1, mb: 1 }} variant="button" gutterBottom>Progetti {data.projects && data.projects.length}</Typography>
                <Suspense fallback={<Skeleton variant="rectangular" width={100} height={100} />}>
                    <CreateProjectAsync />
                </Suspense>
            </div>
            <Divider sx={{ width: '100%' }} />
            <Suspense fallback={skeletonList()}>
                <ListAsync style={{ marginTop: "1rem" }} headerText={""} datalist={projects} renderDataItem={(item, index) => (
                    <ProjectCardAsync key={item} itemId={item} />
                )}>
                </ListAsync>
            </Suspense>
        </div>
    )
}
