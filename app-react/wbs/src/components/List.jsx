import React, { Fragment } from 'react'
import { Stack, Typography, Divider } from '@mui/material';

export default function List({ style, children, datalist, headerText, renderDataItem }) {
    return (
        <Fragment>
            <Typography variant="h2">{headerText}</Typography>
            <Divider style={{ width: 'inherit' }} />
            <Stack direction={"column"} spacing={2}>
                {datalist.map(item => (
                    renderDataItem(item)
                ))}
            </Stack>
            {
                children
            }
        </Fragment>
    )
}
