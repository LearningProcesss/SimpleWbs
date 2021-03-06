import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Typography';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useState } from 'react';
import {
    useMutation, useQuery, useQueryClient
} from 'react-query';


export default function CreateClient({ children, style }) {

    const queryClient = useQueryClient();

    const { isLoading, isError, data, error } = useQuery("allUsers", () => {
        return fetch(`http://127.0.0.1:5000/api/v1/users`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            const result = res.json();
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
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });

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
        return <Skeleton variant="rectangular" width={"48px"} height={"170px"} />
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div style={style}>
            <Fab onClick={handleClickOpen} variant="extended">
                <CorporateFareIcon sx={{ mr: 1 }} />
                Aggiungi Cliente
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Nuovo cliente</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Crea un nuovo Cliente. Puoi anche assegnare gli utenti.
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
                            <Typography>Utenti</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Gli utenti selezionati saranno assegnati al progetto.
                            </Typography>
                            <FormGroup>
                                {
                                    data !== null ? data.map((user, index) => (
                                        <FormControlLabel key={user.userId} control={<Checkbox id={'' + user.userId} key={user.userId + '' + index} onChange={onChangeCheck} />} label={`${user.name} ${user.surname} ${user.email}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <LoadingButton
                        onClick={handleCloseWithCreate}
                        loading={createClient.isLoading}
                        loadingIndicator="Loading..."
                        variant="outlined"
                    >
                        Crea
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
