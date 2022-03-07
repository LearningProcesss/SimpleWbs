import DeleteIcon from '@mui/icons-material/Delete';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Skeleton, Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function DocumentCard({ children, styles, itemId, fatherId }) {

    const queryClient = useQueryClient();

    const { isLoading, isError, data, error } = useQuery(`document_${itemId}`, () =>
        fetch(`http://127.0.0.1:5000/api/v1/documents/${itemId}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
    );

    const deleteDocument = useMutation(documentId => {
        return fetch(`http://127.0.0.1:5000/api/v1/documents/${documentId}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries(`project_${fatherId}`);
        }
    });

    const approveDocument = useMutation(approve => {
        console.log(approve)
        return fetch(`http://127.0.0.1:5000/api/v1/documents/${itemId}/setApprovation`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(approve)
        })
    }, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries([`project_${fatherId}`]);
        }
    });

    const [approveModalOpen, setApproveModalOpen] = useState(false);

    const onDeleteClickHandler = useCallback(() => {
        deleteDocument.mutate(itemId);
    }, []);

    const onOpenModalHandler = useCallback(() => {
        setApproveModalOpen(true);
    }, []);

    const onCloseModalHandler = useCallback(() => {
        setApproveModalOpen(false);
    }, []);

    const onCloseModalHandlerWithFalse = useCallback((event) => {

        approveDocument.mutate({ isApproved: false });

        setApproveModalOpen(false);
    }, [])

    const onCloseModalHandlerWithTrue = useCallback((event) => {

        approveDocument.mutate({ isApproved: true });

        setApproveModalOpen(false);
    }, [])

    if (!itemId) {
        return null;
    }

    if (isLoading) {
        return (
            <Stack spacing={1}>
                <Skeleton variant="text" />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={118} />
            </Stack>
        )
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const { documentId, fileName, isApproved } = data;

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: "space-between" }}>
                <CardContent>
                    <Typography variant="h5">{fileName}</Typography>
                </CardContent>
                <CardActions>
                    <Stack style={{ margin: "1rem" }} direction="row" spacing={1}>
                        {/* <EditProject entity={data} /> */}
                        <Fab color="error" aria-label="delete" onClick={onDeleteClickHandler} disabled={deleteDocument.isLoading}>
                            <DeleteIcon />
                        </Fab>
                        <Fab color={isApproved ? "success" : "default"} aria-label="detail" onClick={onOpenModalHandler} disabled={deleteDocument.isLoading}>
                            {
                                isApproved ? <ThumbUpAltIcon /> : <ThumbDownAltIcon />
                            }
                        </Fab>
                    </Stack>
                </CardActions>
            </Card>
            <Dialog open={approveModalOpen} onClose={onCloseModalHandler}>
                <DialogTitle>Approvazione documento {fileName}</DialogTitle>
                <DialogContent style={{ textAlign: 'center' }}>
                    Vuoi approvare o rifiutare?
                </DialogContent>
                <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "1rem" }}>
                        <Fab id="disapprove" aria-label="disapprove" onClick={onCloseModalHandlerWithFalse} disabled={deleteDocument.isLoading}>
                            <ThumbDownAltIcon />
                        </Fab>
                        <span>Rifiuta</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "1rem" }}>
                        <Fab id="approve" aria-label="approve" onClick={onCloseModalHandlerWithTrue} disabled={deleteDocument.isLoading}>
                            <ThumbUpAltIcon />
                        </Fab>
                        <span>Accetta</span>
                    </div>
                </DialogActions>
            </Dialog>

        </>
    )
}
