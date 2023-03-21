import React from 'react'
import styles from '@/styles/components/Thread.module.css'

import Link from 'next/link'
import ThreadImage from '@/components/ThreadImage'

const Thread = ({ item }) => {
    return (
        <div className={styles.item}>
            <Link href={`/thread/${item.id}`}>
                <ThreadImage src={item.thread_images[0].path} alt="image" />
            </Link>
        </div>
    )
}

export default Thread
