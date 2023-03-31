import React from 'react'
import styles from '@/styles/components/TimelineThread.module.css'

import Link from 'next/link'
import Image from './Image'

const TimelineThread = ({ thread }) => {
    // 日付のフォーマットを変更
    const timestamp = thread.updated_at
    const date = new Date(timestamp)
    const formatted_date = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date
        .getDate()
        .toString()
        .padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

    return (
        <div className={styles.threadBox}>
            <Link href={`/thread/${thread.id}`}>
                <div className={styles.threadImageBox}>
                    <Image
                        src={thread.thread_images[0].path}
                        alt="thread_image"
                        style="w-full h-full object-contain"
                    />
                </div>

                <div className={styles.userInfo}>
                    <Image
                        src={
                            thread?.user?.icon_path
                                ? thread.user.icon_path
                                : '/icon.png'
                        }
                        alt="icon"
                        style="h-8 w-8 rounded-full border border-gray-400 ml-2"
                    />
                    <p className={styles.username}>{thread?.user?.name}</p>
                </div>
                <div className={styles.statusBox}>
                    <div className={styles.statusCount}>
                        <p className={styles.date}>{formatted_date}</p>
                        <div className={styles.flex}>
                            <div className={styles.status}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                    />
                                </svg>
                                <p>{thread.bookmarked_threads_count}</p>
                            </div>
                            <div className={styles.status}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                </svg>
                                <p>{thread.liked_threads_count}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default TimelineThread
