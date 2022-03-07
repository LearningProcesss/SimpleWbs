import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
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
import { useState } from 'react';
import {
    useMutation, useQuery, useQueryClient
} from 'react-query';


export default function CreateUser({ children, style, entityFatherId }) {

    const queryClient = useQueryClient();

    const allClients = useQuery("allClients", () => {
        return fetch(`http://127.0.0.1:5000/api/v1/clients`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accesstoken')
            }
        }).then((res) => {
            const result = res.json();
            return result;
        })
    }
    );
    const allProjects = useQuery("allProjects", () => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accesstoken')
            }
        }).then((res) => {
            const result = res.json();
            return result;
        })
    }
    );
    const createUserMutation = useMutation(newUser => {
        return fetch("http://127.0.0.1:5000/api/v1/users", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });
    const createLinkClientUserMutation = useMutation(linkClientUser => {
        return fetch(`http://127.0.0.1:5000/api/v1/clients/${linkClientUser.clientId}/users/${linkClientUser.userId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }, {
        onSuccess: (data, variables, context) => {
            // queryClient.invalidateQueries();
        }
    });

    const [userName, setUserName] = useState(null);
    const [userSurnName, setUserSurnName] = useState(null);
    const [userEmail, setEmail] = useState(null);
    const [userPassword, setPassword] = useState(null);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseWithCreate = () => {
        // createUserMutation.mutate({ name: userName, clientToBeLinked: clientToBeLinked, usersToBeLinked: [...new Set(selectedUsers)] });

        createUserMutation.mutate({ name: userName, surname: userSurnName, email: userEmail, password: userPassword });

        const uniqueClientsIdToDo = [...new Set(selectedClients)];

        for (const userId of uniqueClientsIdToDo) {
            createLinkClientUserMutation.mutate({ clientId: entity.clientId, userId: userId });
        }

        setOpen(false);
    }

    const onChangeSelectedClient = (e) => {
        setSelectedClients(prevState => [...prevState, parseInt(e.target.id)]);
    }

    const onChangeSelectedProject = (e) => {
        setSelectedProjects(prevState => [...prevState, parseInt(e.target.id)]);
    }

    if (allClients.isLoading || allProjects.isLoading) {
        return <span>Loading...</span>
    }

    if (allClients.isError) {
        return <span>Error: {allClients.message}</span>
    }

    return (
        <div style={style}>
            <Fab onClick={handleClickOpen} variant="extended">
                <PersonIcon sx={{ mr: 1 }} />
                Aggiungi Utente
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Nuovo Utente</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Crea un nuovo Utente. Puoi anche assegnarlo a Clienti e Progetti.
                    </DialogContentText>
                    <TextField onChange={(e) => setUserName(e.target.value)} margin="dense" id="name" label="Name" type="text" fullWidth variant="standard" />
                    <TextField onChange={(e) => setUserName(e.target.value)} margin="dense" id="surname" label="Surname" type="text" fullWidth variant="standard" />
                    <TextField onChange={(e) => setUserName(e.target.value)} margin="dense" id="email" label="Email" type="email" fullWidth variant="standard" />
                    <TextField onChange={(e) => setUserName(e.target.value)} margin="dense" id="password" label="Password" type="password" fullWidth variant="standard" />
                    <Divider style={{ marginTop: "1em" }} />
                    <Accordion style={{ marginTop: "1em" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Assegnazione Clienti</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {
                                    allClients.data !== null ? allClients.data.map((client, index) => (
                                        <FormControlLabel key={client.clientId} control={<Checkbox id={'' + client.clientId} key={client.clientId} onChange={onChangeSelectedClient} />} label={`${client.name}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion style={{ marginTop: "1em" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Assegnazione Progetti</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {
                                    allProjects.data !== null ? allProjects.data.map((project, index) => (
                                        <FormControlLabel key={project.projectId} control={<Checkbox id={'' + project.projectId} key={project.projectId} onChange={onChangeSelectedProject} />} label={`${project.name}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <LoadingButton
                        onClick={handleCloseWithCreate}
                        loading={createUserMutation.isLoading}
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
