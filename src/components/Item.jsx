import React from 'react'
import styles from '@/styles/components/Thread.module.css'
import ThreadImage from '@/components/ThreadImage'

const Item = ({ item }) => {
    return (
        <div className={styles.item}>
            <ThreadImage src={item.item_images[0].path} alt="image" />
        </div>
    )
}

export default Item
