import React from 'react'
import styles from '@/styles/follows.module.css'
import Image from '@/components/Image'
import Link from 'next/link'

const FollowUserInfo = ({ user, auth }) => {
    // console.log(user)

    return (
        <Link href={`/profile/${user.id}`}>
            <div className={styles.userInfo}>
                <div className={styles.info}>
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
                </div>
                {user.id !== auth &&
                    (user.is_following ? (
                            <button className={styles.followButton}>
                                UnFollow
                            </button>
                    ) : (
                            <button className={styles.unFollowButton}>
                                Follow
                            </button>
                    ))}
            </div>
        </Link>
    )
}

export default FollowUserInfo
