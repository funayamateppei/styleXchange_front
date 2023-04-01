import React from 'react'
import styles from '@/styles/LikeAndBookmark.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const bookmark = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const PAGE_SIZE = 9

    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [items, setItems] = useState([])

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }
    const { data, error } = useSWR(
        `/api/my/bookmarks?page=${currentPage}&size=${PAGE_SIZE}`,
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
                    <div className={styles.content}></div>
                </div>
            </Header>
        </Layout>
    )
}

export default bookmark
