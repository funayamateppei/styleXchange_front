import React from 'react'
import styles from '@/styles/components/ExhibitImage.module.css'

const ExhibitImage = ({ index, src, onDelete }) => {
    return (
        <div className={styles.imageBox}>
            {/* 画像index */}
            <div className={styles.index}>{index + 1}</div>
            {/* 画像 */}
            <img src={src} className={styles.img} />
            {/* 削除ボタン */}
            <button className={styles.closeButton} onClick={onDelete}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </button>
        </div>
    )
}

export default ExhibitImage
