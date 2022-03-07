import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingButton from '@mui/lab/LoadingButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
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
import Fab from '@mui/material/Fab';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useState } from 'react';
import {
    useMutation, useQuery, useQueryClient
} from 'react-query';


export default function EditUser({ children, style, entity }) {

    console.log(entity);

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
    const editUserMutation = useMutation(editUserData => {
        return fetch(`http://127.0.0.1:5000/api/v1/users/${entity.userId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editUserData)
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
    const deleteLinkClientUserMutation = useMutation(linkClientUser => {
        return fetch(`http://127.0.0.1:5000/api/v1/clients/${linkClientUser.clientId}/users/${linkClientUser.userId}`, {
            method: "DELETE",
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

    const createLinkProjectUserMutation = useMutation(linkProjectUser => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects/${linkProjectUser.projectId}/users/${linkProjectUser.userId}`, {
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
    const deleteLinkProjectUserMutation = useMutation(linkProjectUser => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects/${linkProjectUser.projectId}/users/${linkProjectUser.userId}`, {
            method: "DELETE",
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



    const [name, setName] = useState(entity.name);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseWithEdit = () => {

        // editUserMutation.mutate({ name: name });

        const uniqueClientsIdToDo = [...new Set(selectedClients)];

        console.log("clients to do", uniqueClientsIdToDo)

        for (const clientId of uniqueClientsIdToDo) {

            const index = entity.clients.indexOf(parseInt(clientId));

            if (parseInt(index) == -1) {
                console.log(`id: ${clientId} to be created - index ${index}`);
                createLinkClientUserMutation.mutate({ clientId: clientId, userId: entity.userId });
            }
            else {
                console.log(`id: ${clientId} to be deleted - index ${index}`);
                deleteLinkClientUserMutation.mutate({ clientId: clientId, userId: entity.userId });
            }
        }

        const uniqueProjectsIdToDo = [...new Set(selectedProjects)];

        console.log("projects to do", uniqueProjectsIdToDo)


        for (const projectId of uniqueProjectsIdToDo) {

            const index = entity.projects.indexOf(parseInt(projectId));

            if (parseInt(index) == -1) {
                console.log(`id: ${projectId} to be created - index ${index}`);
                createLinkProjectUserMutation.mutate({ projectId: projectId, userId: entity.userId });
            }
            else {
                console.log(`id: ${projectId} to be deleted - index ${index}`);
                deleteLinkProjectUserMutation.mutate({ projectId: projectId, userId: entity.userId });
            }
        }

        setSelectedClients([]);
        setSelectedProjects([]);
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
            <Fab color="warning" aria-label="add" onClick={handleOpen}>
                <ModeEditOutlineIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Utente {entity.email}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifica i dati dell' utente. Puoi assegnarlo a Clienti e Progetti.
                    </DialogContentText>
                    <TextField onChange={(e) => setName(e.target.value)} value={name} autoFocus margin="dense" id="name" label="Name" type="text" fullWidth variant="standard" />
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
                                        <FormControlLabel key={client.clientId} control={<Checkbox id={'' + client.clientId} key={client.clientId} defaultChecked={entity.clients.indexOf(client.clientId) >= 0} onChange={onChangeSelectedClient} />} label={`${client.name}`} />)) : null
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
                                        <FormControlLabel key={project.projectId} control={<Checkbox id={'' + project.projectId} key={project.projectId} defaultChecked={entity.projects ? entity.projects.indexOf(project.projectId) >= 0 : false} onChange={onChangeSelectedProject} />} label={`${project.name}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <LoadingButton
                        onClick={handleCloseWithEdit}
                        loading={editUserMutation.isLoading}
                        loadingIndicator="Loading..."
                        variant="outlined"
                    >
                        Modifica
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
