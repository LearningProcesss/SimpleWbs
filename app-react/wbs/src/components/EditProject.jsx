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


export default function EditProject({ children, style, entity }) {

    console.log(entity);

    const queryClient = useQueryClient();

    const { isLoading, isError, data, error } = useQuery("allUsers", () => {
        return fetch(`http://127.0.0.1:5000/api/v1/users`, {
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
    const editProjectMutation = useMutation(editProjectData => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects/${entity.projectId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editProjectData)
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });
    const createLinkProjectUserMutation = useMutation(linkProjectUser => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects/${linkProjectUser.projectId}/users/${linkProjectUser.userId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(linkProjectUser)
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });
    const deleteLinkProjectUserMutation = useMutation(linkProjectUser => {
        return fetch(`http://127.0.0.1:5000/api/v1/projects/${linkProjectUser.projectId}/users/${linkProjectUser.userId}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(linkProjectUser)
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });


    const [name, setName] = useState(entity.name);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleCloseWithEdit = () => {
    //     editProjectMutation.mutate({ name: name });

    //     setOpen(false);
    // }

    const handleCloseWithEdit = () => {

        editProjectMutation.mutate({ name: name });

        console.log(selectedUsers);

        const uniqueUsersIdToDo = [...new Set(selectedUsers)];

        for (const userId of uniqueUsersIdToDo) {

            const index = entity.users.indexOf(parseInt(userId));

            if (parseInt(index) == -1) {
                console.log(`id: ${userId} to be created - index ${index}`);
                createLinkProjectUserMutation.mutate({ projectId: entity.projectId, userId: userId });
            }
            else {
                console.log(`id: ${userId} to be deleted - index ${index}`);
                deleteLinkProjectUserMutation.mutate({ projectId: entity.projectId, userId: userId })
            }
        }

        setSelectedUsers([]);
        setOpen(false);
    }

    const onChangeCheck = (e) => {
        console.log(selectedUsers);

        console.log("target check", e.target.id);

        setSelectedUsers(prevState => [...prevState, parseInt(e.target.id)]);
    }

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div style={style}>
            <Fab color="warning" aria-label="add" onClick={handleOpen}>
                <ModeEditOutlineIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Progetto {entity.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifica i dati del progetto progetto. Puoi assegnare anche gli utenti.
                    </DialogContentText>
                    <TextField onChange={(e) => setName(e.target.value)} value={name} autoFocus margin="dense" id="name" label="Name" type="text" fullWidth variant="standard" />
                    <Divider style={{ marginTop: "1em" }} />
                    <Accordion style={{ marginTop: "1em" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Assegnazione Utenti</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {
                                    data !== null ? data.map((user, index) => (
                                        <FormControlLabel key={user.userId} control={<Checkbox id={'' + user.userId} key={user.userId} defaultChecked={entity.users.indexOf(user.userId) >= 0} onChange={onChangeCheck} />} label={`${user.name} ${user.surname} ${user.email}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <LoadingButton
                        onClick={handleCloseWithEdit}
                        loading={editProjectMutation.isLoading}
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
