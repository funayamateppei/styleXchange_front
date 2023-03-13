import React from 'react'
import styles from '@/styles/follows.module.css'
import Image from '@/components/Image'
import { useState } from 'react'

const FollowUserInfo = ({ user }) => {
    const [following, setFollowing] = useState(false)

    // if (authId && user.pivot.following_id === authId) {
    //     setFollowing(true)
    // }

    return (
        <div className={styles.userInfo}>
            <Image
                src={user.icon_path}
                alt="icon"
                style="rounded-full w-12 h-12"
            />
            <p className={styles.userName}>{user.name}</p>
            {/* {following ? <button>UnFollow</button> : <button>Follow</button>} */}
        </div>
    )
}

export default FollowUserInfo
