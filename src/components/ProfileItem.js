import React from 'react'
import styles from '@/styles/profile.module.css'
import { useState } from 'react'
import Thread from '@/components/Thread'
import Item from '@/components/Item'

const ProfileItem = ({ data }) => {
    // threadを表示しているかitemを表示しているかの状態管理
    // trueがthread falseがitem
    const [mode, setMode] = useState(true)
    const modeChangeThread = () => {
        setMode(true)
    }
    const modeChangeItem = () => {
        setMode(false)
    }

    return (
        <>
            <div className={styles.threads}>
                <div className={styles.threadLayout}>
                    <button
                        className={`${styles.modeButton} ${
                            mode === true ? styles.modeChange : ''
                        }`}
                        onClick={modeChangeThread}>
                        <img
                            src="thread.svg"
                            alt="thread"
                            className="w-8 h-8"
                        />
                    </button>
                    <button
                        className={`${styles.modeButton} ${
                            mode === false ? styles.modeChange : ''
                        }`}
                        onClick={modeChangeItem}>
                        <img src="item.svg" alt="item" className="w-8 h-8" />
                    </button>
                </div>
            </div>
            <div className={styles.items}>
                {mode === true
                    ? data && data.threads && Array.isArray(data.threads)
                        ? data.threads.map(item => (
                              <Thread item={item} key={item.id} />
                          ))
                        : null
                    : data && data.items && Array.isArray(data.items)
                    ? data.items.map(item => <Item item={item} key={item.id} />)
                    : null}
            </div>
        </>
    )
}

export default ProfileItem
