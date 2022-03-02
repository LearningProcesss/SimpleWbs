import React from 'react'

export default function ClientCard({ children, styles, item }) {
    console.log("card!")
    return (
        <div>Client Id: {item}</div>
    )
}
