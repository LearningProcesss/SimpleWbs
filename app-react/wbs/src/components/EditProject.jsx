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
    console.log("EditProject", entity);

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
    const editProjectMutation = useMutation(editProjectData => {
        return fetch(`http://127.0.0.1:5000/api/v1/project/${editProjectData.projectId}`, {
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
    const linkProjectUserMutation = useMutation(linkProjectUser => {
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

    const [name, setName] = useState(entity.name);
    const [selectedUsers, setSelectedUsers] = useState(entity.users ? entity.users : []);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseWithCreate = () => {
        // createClient.mutate({ name: clientName, vat: clientVat, usersToBeLinked: [...new Set(selectedUsers)] });

        editProjectMutation.mutate({ name: name});

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
            <Fab color="warning" aria-label="add" onClick={handleOpen}>
                <ModeEditOutlineIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Client</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Edit Client. Assign users also.
                    </DialogContentText>
                    <TextField onChange={(e) => setName(e.target.value)} value={name} autoFocus margin="dense" id="name" label="Name" type="text" fullWidth variant="standard" />
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
                                All selected users are automatically assigned to the Client.
                            </Typography>
                            <FormGroup>
                                {
                                    data !== null ? data.map((user, index) => (
                                        <FormControlLabel key={user.userId} control={<Checkbox id={'' + user.userId} key={user.userId} defaultChecked={selectedUsers.indexOf(user.userId) >= 0} onChange={onChangeCheck} />} label={`${user.name} ${user.surname} ${user.email}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton
                        onClick={handleCloseWithCreate}
                        loading={editProjectMutation.isLoading}
                        loadingIndicator="Loading..."
                        variant="outlined"
                    >
                        Edit
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}
