import React from 'react'
import styles from '@/styles/searchResult.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import TimelineThread from '@/components/TimelineThread'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'

const category = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const router = useRouter()
    const { gender, category } = router.query // gender:1=MENS 2=LADIES

    const PAGE_SIZE = 8

    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [threads, setThreads] = useState([])

    // 新着順or30日以内に投稿されたthreadでいいね順 like:いいね順 new:新着順
    const [sortBy, setSortBy] = useState('like') // 初期値はlike
    const [isOpenDropdown, setIsOpenDropdown] = useState(false)

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }
    const { data, error } = useSWR(
        `/api/search/thread/category?page=${currentPage}&size=${PAGE_SIZE}&gender=${gender}&category=${category}&sort=${sortBy}`,
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

    console.log(data)

    if (isLoading) {
        return (
            <div className={styles.flexContainer}>
                <img src="/loading.gif" alt="loading" />
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
            <Header>
                <Head>
                    <title>Exhibit</title>
                </Head>

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
                                      <TimelineThread
                                          key={index}
                                          thread={thread}
                                      />
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
            </Header>
            <FooterTabBar user={user} />
        </Layout>
    )
}

export default category
