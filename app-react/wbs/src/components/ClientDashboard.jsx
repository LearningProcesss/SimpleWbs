import { Fragment } from 'react';
import { useQuery } from 'react-query';
import { useAuthContext } from '../hooks/authcontext';
import ClientCard from './ClientCard';
import CreateClient from './CreateClient';
import List from './List';

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
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <Fragment>
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "2em" }}>
                <CreateClient style={{ merginTop: "50rem" }} />
                <List headerText={"Clients"} datalist={data.clients} renderDataItem={(item, index) => (
                    <ClientCard key={item.clientId} itemId={item} />
                )}>
                </List>
            </div>

        </Fragment>
    )
}
