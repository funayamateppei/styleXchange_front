import React from 'react'
import styles from '@/styles/LikeAndBookmark.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

const like = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const [isThreadSelected, setIsThreadSelected] = useState(1)

    const PAGE_SIZE = 9

    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [items, setItems] = useState([])

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios.get(url).then(response => response.data)
    }
    const { data, error } = useSWR(
        `/api/my/likes?page=${currentPage}&size=${PAGE_SIZE}&isThreadSelect=${isThreadSelected}`,
        fetcher,
    )

    console.log(data)

    return (
        <Layout>
            <Header>
                <Head>
                    <title>Profile</title>
                </Head>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <button
                                disabled={isThreadSelected ? 1 : 0}
                                onClick={() => setIsThreadSelected(1)}>
                                コーデ
                            </button>
                            <button
                                disabled={isThreadSelected ? 0 : 1}
                                onClick={() => setIsThreadSelected(0)}>
                                アイテム
                            </button>
                        </div>
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export default like
