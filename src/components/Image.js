import React from 'react'

const Image = ({ src, alt }) => {
    return (
        <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${src}`}
        alt={ alt}
        />
    )
}

export default Image
