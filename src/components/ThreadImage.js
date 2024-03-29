import React from 'react'

const ThreadImage = ({ src, alt }) => {
    return (
        <img
            src={`${process.env.NEXT_PUBLIC_AWS_URL}${src}`}
            alt={alt}
            className="w-full h-full"
        />
    )
}

export default ThreadImage
