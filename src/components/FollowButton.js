import React from 'react'
import styles from '@/styles/follows.module.css'

const FollowButton = ({ data }) => {
    console.log(data)
    return (
        <>
            {data.is_following ? (
                <button className={styles.followButton}>unFollow</button>
            ) : (
                <button className={styles.unFollowButton}>follow</button>
            )}
        </>
    )
}

export default FollowButton
