import React from 'react'

const ThreadImage = ({src, alt}) => {
    return (
        <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${src}`}
            alt={alt}
        />
    )
}

export default ThreadImage