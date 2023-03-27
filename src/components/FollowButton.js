import React from 'react'
import styles from '@/styles/follows.module.css'

import axios from '@/lib/axios'

const FollowButton = ({ data, onClick }) => {
    return (
        <>
            {data.is_following ? (
                <button onClick={onClick} className={styles.followButton}>
                    unFollow
                </button>
            ) : (
                <button onClick={onClick} className={styles.unFollowButton}>
                    follow
                </button>
            )}
        </>
    )
}

export default FollowButton
