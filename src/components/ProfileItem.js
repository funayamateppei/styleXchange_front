import React from 'react'
import styles from '@/styles/profile.module.css'
import { useState } from 'react'
import Thread from '@/components/Thread'
import Item from '@/components/Item'

const ProfileItem = ({ data }) => {
    // threadを表示しているかitemを表示しているかの状態管理
    // trueがthread falseがitem
    const [mode, setMode] = useState(true)
    const modeChange = isThread => {
        setMode(isThread)
    }

    return (
        <>
            <div className={styles.threads}>
                <div className={styles.threadLayout}>
                    <button
                        className={`${styles.modeButton} ${
                            mode ? styles.modeChange : ''
                        }`}
                        onClick={() => modeChange(true)}
                        disabled={mode}>
                        <img
                            src="../thread.svg"
                            alt="thread"
                            className="w-8 h-8"
                        />
                    </button>
                    <button
                        className={`${styles.modeButton} ${
                            mode ? '' : styles.modeChange
                        }`}
                        onClick={() => modeChange(false)}
                        disabled={!mode}>
                        <img src="../item.svg" alt="item" className="w-8 h-8" />
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
