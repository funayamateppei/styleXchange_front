import React from 'react'
import styles from '@/styles/search.module.css'
import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import FooterTabBar from '@/components/FooterTabBar'
import { useAuth } from '@/hooks/auth'

const Search = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <Layout>
            <Head>
                <title>Exhibit</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.content}>{/* ページコンテンツ */}</div>
                <FooterTabBar user={user} />
            </div>
        </Layout>
    )
}

export default Search
