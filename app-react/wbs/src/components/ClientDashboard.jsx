import { Fragment, lazy, Suspense } from 'react';
import { useQuery } from 'react-query';
import { useAuthContext } from '../hooks/authcontext';
import ClientCard from './ClientCard';
import { Skeleton } from '@mui/material'

const ListAsync = lazy(() => import('./List'));
const CreateClientAsync = lazy(() => import('./CreateClient'));

export default function ClientDashboard() {

    const { userId } = useAuthContext();

    const { isLoading, isError, data, error } = useQuery("usersWithClientsId", () =>
        fetch(`http://127.0.0.1:5000/api/v1/users/${userId}/clients`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    if (isLoading) {
        return (
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "2em" }}>
                <Skeleton variant="rectangular" width={100} height={100} />
            </div>
        )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    function skeletonList() {
        return Array.from(Array(10).keys(), (n) => (
            <div style={{ margin: "1rem" }}>
                <Skeleton variant="rectangular" width={250} height={300} />
            </div>
        ))
    }

    return (
        <Fragment>
            {/* <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "2em" }}> */}
                <Suspense fallback={<Skeleton variant="rectangular" width={100} height={100} />}>
                    <CreateClientAsync />
                </Suspense>
                <Suspense fallback={skeletonList()}>
                    <ListAsync headerText={""} datalist={data.clients} renderDataItem={(item, index) => (
                        <ClientCard key={item.clientId} itemId={item} />
                    )}>
                    </ListAsync>
                </Suspense>
            {/* </div> */}
        </Fragment>
    )
}
