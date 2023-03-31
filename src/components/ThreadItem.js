import React from 'react'

import styles from '@/styles/components/ThreadItem.module.css'

import Link from 'next/link'
import Image from '@/components/Image'

const ThreadItem = ({ item }) => {
    const price = item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return (
        <div className={styles.container}>
            <Link href={`/item/${item.id}`}>
                <div className={styles.itemImageBox}>
                    <Image src={item.item_images[0].path} alt="item image" />
                    <p className={styles.price}>¥ {price}</p>
                </div>
                <p className={styles.title}>{item.title}</p>
            </Link>
        </div>
    )
}

export default ThreadItem
