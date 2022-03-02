import { useEffect, useState, Fragment } from 'react';
import { useAuthContext } from '../hooks/authcontext';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import CreateClient from './CreateClient';
import ClientCard from './ClientCard';
import {
    useQuery,
} from 'react-query'
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

    console.log("ClientsRecap-userId", userId);

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
                {/* <ul>
                    {data.clients.map((client, index) => (
                        <li key={client + index}>{client}</li>
                    ))}
                </ul> */}
                <List datalist={data.clients} renderDataItem={(item) => (
                    <ClientCard key={item} item={item}>
                        
                    </ClientCard>
                )}>
                </List>
            </div>

        </Fragment>
    )
}
