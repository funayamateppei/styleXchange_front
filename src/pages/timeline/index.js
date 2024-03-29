import React from 'react'
import styles from '@/styles/timeline.module.css'

import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import TimelineThread from '@/components/TimelineThread'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const Timeline = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const PAGE_SIZE = 8

    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [threads, setThreads] = useState([])

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }

    const { data, error } = useSWR(
        `/api/timeline?page=${currentPage}&size=${PAGE_SIZE}`,
        fetcher,
    )

    useEffect(() => {
        if (data) {
            setThreads(prevThreads => [...prevThreads, ...data.data])
            setIsLoading(false)
        }
    }, [data])

    const handleScroll = () => {
        const scrollTop =
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop
        const scrollHeight =
            (document.documentElement &&
                document.documentElement.scrollHeight) ||
            document.body.scrollHeight
        const clientHeight =
            document.documentElement.clientHeight || window.innerHeight
        const scrolledToBottom =
            Math.ceil(scrollTop + clientHeight) >= scrollHeight
        if (scrolledToBottom && data && data.next_page_url) {
            setCurrentPage(prevPage => prevPage + 1)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [data])

    console.log(data)

    if (isLoading) {
        return (
            <div className={styles.flexContainer}>
                <img src="loading.gif" alt="loading" />
                <FooterTabBar user={user} />
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.flexContainer}>
                <p>エラーが発生しました</p>
                <FooterTabBar user={user} />
            </div>
        )
    }

    return (
        <Layout>
            <Head>
                <title>Exhibit</title>
            </Head>
            <div className={styles.header}>
                <p>フォロー中</p>
            </div>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.itemBox}>
                        {threads
                            ? threads.map((thread, index) => (
                                  <TimelineThread key={index} thread={thread} />
                              ))
                            : null}
                    </div>
                    {data
                        ? !data.next_page_url && (
                              <div className={styles.noMoreData}>
                                  これ以上ありません
                              </div>
                          )
                        : null}
                </div>
            </div>
            <FooterTabBar user={user} />
        </Layout>
    )
}

export default Timeline
