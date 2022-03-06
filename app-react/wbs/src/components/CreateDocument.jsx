import FilePresentIcon from '@mui/icons-material/FilePresent';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton, Input, Fab } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import {
    useMutation, useQueryClient
} from 'react-query';


export default function CreateDocument({ children, style, entityFatherId }) {

    const queryClient = useQueryClient();

    const createDocumentMutation = useMutation(newDocument => {
        return fetch(`http://127.0.0.1:5000/api/v1/documents?projectId=${entityFatherId}`, {
            method: "POST",
            headers: {
                "accept": "*/*",
            },
            body: newDocument
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries();
        }
    });

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectedFile = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleCloseWithCreate = () => {

        let formData = new FormData();

        formData.append("file", selectedFile);

        createDocumentMutation.mutate(formData);

        setOpen(false);
    }

    return (
        <div style={style}>
            <Fab onClick={handleClickOpen} variant="extended">
                <FilePresentIcon sx={{ mr: 1 }} />
                Aggiungi Documento
            </Fab>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create new Document uploading file.</DialogTitle>
                <DialogContent>
                    <label htmlFor="contained-button-file">
                        <Input onChange={handleSelectedFile} style={{ display: 'none' }} accept="" id="contained-button-file" type="file" />
                        <Button variant="contained" component="span">
                            Upload
                        </Button>
                    </label>
                    <span style={{ marginLeft: "1rem" }}>{selectedFile ? selectedFile.name : ''}</span>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton
                        onClick={handleCloseWithCreate}
                        loading={createDocumentMutation.isLoading}
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
