import React from 'react'
import styles from '@/styles/components/Thread.module.css'

import Link from 'next/link'
import ThreadImage from '@/components/ThreadImage'

const Item = ({ item }) => {
    return (
        <div className={styles.item}>
            <Link href={`/item/${item.id}`}>
                <ThreadImage src={item.item_images[0].path} alt="image" />
            </Link>
        </div>
    )
}

export default Item
