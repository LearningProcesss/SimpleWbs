import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
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
import { useState } from 'react';
import {
    useMutation, useQuery, useQueryClient
} from 'react-query';


export default function CreateProject({ children, style, entityFatherId }) {

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
    const createProjectMutation = useMutation(newProject => {
        return fetch("http://127.0.0.1:5000/api/v1/projects", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProject)
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });

    const [projectName, setProjectName] = useState(null);
    const [clientToBeLinked, setClientToBeLinked] = useState(entityFatherId);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseWithCreate = () => {
        createProjectMutation.mutate({ name: projectName, clientToBeLinked: clientToBeLinked, usersToBeLinked: [...new Set(selectedUsers)] });

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
            <Button variant="contained" color="success" onClick={handleClickOpen} endIcon={<WorkIcon />}>
                Create
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Client</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create new Project. Assign users also.
                    </DialogContentText>
                    <TextField onChange={(e) => setProjectName(e.target.value)} autoFocus margin="dense" id="name" label="Name" type="text" fullWidth variant="standard" />
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
                                        <FormControlLabel key={user.userId + '' + index} control={<Checkbox id={'' + user.userId} key={user.userId + '' + index} onChange={onChangeCheck} />} label={`${user.name} ${user.surname} ${user.email}`} />)) : null
                                }
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton
                        onClick={handleCloseWithCreate}
                        loading={createProjectMutation.isLoading}
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
