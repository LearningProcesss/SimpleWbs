import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useAuthContext } from '../hooks/authcontext';
import { Skeleton, Typography, Divider } from '@mui/material';

const ListAsync = lazy(() => import('./List'));
const CreateUserAsync = lazy(() => import('./CreateUser'));
const UserCardAsync = lazy(() => import('./UserCard'));

export default function UsertDashboard() {

    const { userInfo } = useAuthContext();

    const { isLoading, isError, data, error } = useQuery("allUsers", () =>
        fetch(`http://127.0.0.1:5000/api/v1/users`, {
            method: "GET",
            withCredentials: true,
            credentials: 'include',
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

    console.log(data);

    return (
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <Typography sx={{ color: "" }} variant="h3">Dashboard Utenti</Typography>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
                <Typography sx={{ mt: 1, mb: 1 }} variant="button" gutterBottom>Utenti {data && data.length}</Typography>
                <Suspense fallback={<Skeleton variant="rectangular" width={100} height={100} />}>
                    <CreateUserAsync />
                </Suspense>
            </div>
            <Divider sx={{ width: '100%' }} />
            <Suspense fallback={skeletonList()}>
                <ListAsync style={{ marginTop: "1rem" }} headerText={""} datalist={data} renderDataItem={(item, index) => (
                    <UserCardAsync key={item.userId} itemId={item.userId} />
                )}>
                </ListAsync>
            </Suspense>
        </div>
    )
}
