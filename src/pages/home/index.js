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

    // エンドポイント変更のためのstate 1:mens 2:mix 3:ladies
    const [category, setCategory] = useState(2) // 初期値はmix
    // 新着順or30日以内に投稿されたthreadでいいね順 like:いいね順 new:新着順
    const [sortBy, setSortBy] = useState('like') // 初期値はlike
    const [isOpenDropdown, setIsOpenDropdown] = useState(false)

    const [currentPage, setCurrentPage] = useState(0) // 現在のページ
    const [isLoading, setIsLoading] = useState(true) // ロード中か否か
    const [threads, setThreads] = useState([]) // 表示するdataの配列

    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }

    // エンドポイントを変更する
    let endpoint
    if (category === 1) {
        endpoint = `/api/home/mens?page=${currentPage}&size=${PAGE_SIZE}&sort=${sortBy}`
    } else if (category === 2) {
        endpoint = `/api/home?page=${currentPage}&size=${PAGE_SIZE}&sort=${sortBy}`
    } else if (category === 3) {
        endpoint = `/api/home/ladies?page=${currentPage}&size=${PAGE_SIZE}&sort=${sortBy}`
    }

    const { data, error } = useSWR(endpoint, fetcher)

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

    // カテゴリーchange関数
    const categoryChange = index => {
        window.scrollTo(0, 0)
        setCategory(index)
        setThreads([])
        setCurrentPage(0)
    }

    const DropdownMode = () => {
        setIsOpenDropdown(!isOpenDropdown)
    }
    // sortChange関数
    const sortChange = e => {
        if (e.target.value !== sortBy) {
            window.scrollTo(0, 0)
            setSortBy(e.target.value)
            setThreads([])
            setCurrentPage(0)
            setIsOpenDropdown(false)
        }
    }

    // console.log(data)

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
                <button
                    disabled={category === 1 ? true : false}
                    onClick={() => categoryChange(1)}>
                    MENS
                </button>
                <button
                    disabled={category === 2 ? true : false}
                    onClick={() => categoryChange(2)}>
                    MIX
                </button>
                <button
                    disabled={category === 3 ? true : false}
                    onClick={() => categoryChange(3)}>
                    LADIES
                </button>
            </div>

            <div className={styles.headerForSort}>
                <button onClick={DropdownMode}>
                    {sortBy === 'like' ? 'いいね順' : '新着順'}
                    {isOpenDropdown ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ml-1">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ml-1">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    )}
                </button>
            </div>

            <div
                className={
                    isOpenDropdown
                        ? `${styles.openDropdownList} ${styles.slideDown}`
                        : `${styles.openDropdownList} ${styles.slideUp}`
                }>
                <button
                    disabled={sortBy === 'like' ? true : false}
                    value="like"
                    onClick={sortChange}>
                    いいね順
                    {sortBy === 'like' ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ml-2">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    ) : null}
                </button>
                <button
                    disabled={sortBy === 'new' ? true : false}
                    value="new"
                    onClick={sortChange}>
                    新着順
                    {sortBy === 'new' ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ml-2">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                            />
                        </svg>
                    ) : null}
                </button>
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
