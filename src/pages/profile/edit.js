import React from 'react'
import styles from '@/styles/profileEdit.module.css'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import Image from '@/components/Image'
import AppLayout from '@/components/Layouts/AppLayout'

const edit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const router = useRouter()

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <div
                    className="flex cursor-pointer mt-12 mr-3"
                    onClick={() => {
                        router.back()
                    }}>
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
                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                        />
                    </svg>
                </div>
            </div>
            {/* ページコンテンツ */}
            <div>
                {user?.icon_path ? (
                    <Image
                        src={user.icon_path}
                        alt="icon"
                        style="h-20 w-20 rounded-full border border-gray-400"
                    />
                ) : (
                    <img
                        src="../icon.png"
                        alt="icon"
                        className="h-20 w-20 rounded-full border border-gray-400"
                    />
                )}
            </div>
        </div>
    )
}

export default edit
