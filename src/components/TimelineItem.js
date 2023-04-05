import React from 'react'
import styles from '@/styles/components/TimelineThread.module.css'

import Link from 'next/link'
import Image from './Image'

const TimelineItem = ({ item }) => {
    // 日付のフォーマットを変更
    const timestamp = item.updated_at
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
            <Link href={`/item/${item.id}`}>
                <div className={styles.threadImageBox}>
                    <Image
                        src={item.item_images[0].path}
                        alt="thread_image"
                        style="w-full h-full object-contain"
                    />
                    {/* saleがfalseの場合はsold outを表示 */}
                    {item.sale ? null : <p className={styles.sale}>SOLD OUT</p>} 
                </div>

                <div className={styles.userInfo}>
                    <img
                        src={
                            item?.user?.icon_path
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.user.icon_path}`
                                : '/icon.png'
                        }
                        alt="icon"
                        className="h-8 w-8 rounded-full border border-gray-400 ml-2"
                    />
                    <p className={styles.username}>{item?.user?.name}</p>
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
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                    />
                                </svg>
                                <p>{item.liked_items_count}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default TimelineItem
