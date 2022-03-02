import React from 'react'
import Stack from '@mui/material/Stack';

export default function List({ style, children, datalist, renderDataItem }) {
    console.log("list", datalist, renderDataItem);
    return (
        <Stack direction={"column"} spacing={5}>
            {datalist ?? datalist.map(item => (
                renderDataItem(item)
            ))}
        </Stack>
    )
}
