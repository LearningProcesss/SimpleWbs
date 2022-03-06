import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useAuthContext } from '../hooks/authcontext';
import { Skeleton, Typography, Divider } from '@mui/material';

const ListAsync = lazy(() => import('./List'));
const CreateClientAsync = lazy(() => import('./CreateClient'));
const ClientCardAsync = lazy(() => import('./ClientCard'));

export default function ClientDashboard() {

    const { userInfo } = useAuthContext();

    const { isLoading, isError, data, error } = useQuery("usersWithClientsId", () =>
        fetch(`http://127.0.0.1:5000/api/v1/users/${userInfo.userId}/clients`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "2em" }}>
                {/* <Skeleton variant="rectangular" width={500} height={100} /> */}
            </div>
        )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    function skeletonList() {
        return Array.from(Array(10).keys(), (n) => (
            <div style={{ margin: "1rem", width: "100%" }}>
                <Skeleton variant="rectangular" width={100} height={100} />
            </div>
        ))
    }

    return (
        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <Typography sx={{ color: "" }} variant="h3">Client Dashboard</Typography>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
                <Typography sx={{ mt: 1, mb: 1 }} variant="button" gutterBottom>Clienti {data.clients && data.clients.length}</Typography>
                <Suspense fallback={<Skeleton variant="rectangular" width={100} height={100} />}>
                    <CreateClientAsync />
                </Suspense>
            </div>
            <Divider sx={{ width: '100%' }} />
            <Suspense fallback={skeletonList()}>
                <ListAsync style={{ marginTop: "1rem" }} headerText={""} datalist={data.clients} renderDataItem={(item, index) => (
                    <ClientCardAsync key={item.clientId} itemId={item} />
                )}>
                </ListAsync>
            </Suspense>
        </div>
    )
}
