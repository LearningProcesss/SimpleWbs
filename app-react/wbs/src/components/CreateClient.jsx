import { useEffect, useState, Fragment, useCallback } from 'react';
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

import {
    useQuery,
    useMutation,
} from 'react-query'

export default function CreateClient({ children, style }) {

    const { isLoading, isError, data, error } = useQuery("allUsers", () => {
        return fetch(`http://127.0.0.1:5000/api/v1/users`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            const result = res.json();
            console.log('from query', result);
            return result;
        })
    }
    );
    const createClient = useMutation(newClient => {
        return fetch("http://127.0.0.1:5000/api/v1/clients", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClient)
        })
    })

    const [clientName, setClientName] = useState(null);
    const [clientVat, setClientVat] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseWithCreate = () => {
        createClient.mutate({ name: clientName, vat: clientVat, usersToBeLinked: [...new Set(selectedUsers)] });

        setOpen(false);
    }

    const onChangeCheck = (e) => {
        if (selectedUsers.indexOf(e.target.id) >= 0) {
            return;
        }

        setSelectedUsers(items => [...items, e.target.id]);
    }

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div style={style}>
            <Button variant="contained" color="success" onClick={handleClickOpen}>
                Create
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Client</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create new Client. Assign users also.
                    </DialogContentText>
                    <TextField onChange={(e) => setClientName(e.target.value)} autoFocus margin="dense" id="name" label="Name" type="text" fullWidth variant="standard" />
                    <TextField onChange={(e) => setClientVat(e.target.value)} margin="dense" id="vat" label="Vat" type="text" fullWidth variant="standard" />
                    <Divider style={{ marginTop: "1em" }} />
                    <Accordion style={{ marginTop: "1em" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>User Assignments</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                All selected users are automatically assigned to the new Client.
                            </Typography>
                            <FormGroup>
                                {
                                    data !== null ? data.map((user, index) => (
                                        <FormControlLabel control={<Checkbox id={'' + user.userId} key={user.userId + '' + index} onChange={onChangeCheck} />} label={`${user.name} ${user.surname} ${user.email}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* <Button onClick={handleCloseWithCreate}>Create</Button> */}
                    <LoadingButton
                        onClick={handleCloseWithCreate}
                        loading={createClient.isLoading}
                        loadingIndicator="Loading..."
                        variant="outlined"
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
