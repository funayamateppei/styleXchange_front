import React from 'react'
import styles from '@/styles/home.module.css'

import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import TimelineThread from '@/components/TimelineThread'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const Home = () => {
    const { user } = useAuth({ middleware: 'guest' })

    const PAGE_SIZE = 8 // どれだけ表示するか

    const [currentPage, setCurrentPage] = useState(1) // 現在のページ
    const [isLoading, setIsLoading] = useState(true) // ロード中か否か
    const [threads, setThreads] = useState([]) // 表示するdataの配列

    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }

    const { data, error } = useSWR(
        `/api/home?page=${currentPage}&size=${PAGE_SIZE}`,
        fetcher,
    )

    // dataが書き変わったらthreadsに取得したデータを追加する
    useEffect(() => {
        if (data) {
            setThreads(prevThreads => [...prevThreads, ...data.data])
            setIsLoading(false)
        }
    }, [data])

    const handleScroll = () => {
        // 現在のスクロール位置
        const scrollTop =
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop
        // ドキュメントの高さ
        const scrollHeight =
            (document.documentElement &&
                document.documentElement.scrollHeight) ||
            document.body.scrollHeight
        // 表示されているビューポートの高さ
        const clientHeight =
            document.documentElement.clientHeight || window.innerHeight
        // ユーザーがページの最下部にスクロールしたかどうかを示す真偽値
        const scrolledToBottom =
            Math.ceil(scrollTop + clientHeight) >= scrollHeight
        // 最下部にスクロールしたか、またはdata.next_page_urlがあるか
        // trueであれば現在のページを次のページに変更
        if (scrolledToBottom && data && data.next_page_url) {
            setCurrentPage(prevPage => prevPage + 1)
        }
    }

    // スクロールイベントを監視
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
                <title>Home</title>
            </Head>
            <div className={styles.header}>
                <p>HOME</p>
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

export default Home
