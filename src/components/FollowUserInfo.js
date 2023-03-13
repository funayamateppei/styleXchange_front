import React from 'react'
import styles from '@/styles/follows.module.css'
import Image from '@/components/Image'
import { useState } from 'react'
import Link from 'next/link'

const FollowUserInfo = ({ user }) => {
    const [following, setFollowing] = useState(false)

    // if (authId && user.pivot.following_id === authId) {
    //     setFollowing(true)
    // }

    return (
        <Link href={`/profile/${user.id}`}>
            <div className={styles.userInfo}>
                {user?.icon_path ? (
                    <Image
                        src={user.icon_path}
                        alt="icon"
                        style="rounded-full border border-gray-400 h-12 w-12"
                    />
                ) : (
                    <img
                        src="../icon.png"
                        alt="icon"
                        className="rounded-full border border-gray-400 h-12 w-12"
                    />
                )}
                <p className={styles.userName}>{user.name}</p>
                {/* {following ? <button>UnFollow</button> : <button>Follow</button>} */}
            </div>
        </Link>
    )
}

export default FollowUserInfo
