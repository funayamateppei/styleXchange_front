import styles from '@/styles/mypage.module.css'
import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import FooterTabBar from '@/components/FooterTabBar'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'

const mypage = () => {
    const { user } = useAuth({ middleware: 'auth' })
    
    return (
        <>
            <AppLayout user={user}>
                <Head>
                    <title>My Page</title>
                </Head>
                <div className={styles.container}>
                    <div className={styles.content}>
                        {/* ページコンテンツ */}
                    </div>
                    <FooterTabBar user={user} />
                </div>
            </AppLayout>
        </>
    )
}

export default mypage
