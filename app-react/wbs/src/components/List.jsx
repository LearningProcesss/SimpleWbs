import React, { Fragment } from 'react'
import { Stack, Typography } from '@mui/material';

export default function List({ style, children, datalist, headerText, renderDataItem }) {
    // console.log("list", datalist, renderDataItem);
    return (
        <Fragment>
            <Typography variant="h2">{headerText}</Typography>
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
