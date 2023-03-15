import React from 'react'
import styles from '@/styles/components/Thread.module.css'
import ThreadImage from '@/components/ThreadImage'

const Thread = ({ item }) => {
  return (
    <div className={styles.item}>
      <ThreadImage src={item.thread_images[0].path} alt='image' />
    </div>
  )
}

export default Thread