import React from 'react'
import styles from '@/styles/searchResult.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import TimelineItem from '@/components/TimelineItem'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState, useEffect } from 'react'

const word = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const router = useRouter()
    const { word } = router.query

    const PAGE_SIZE = 8

    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [items, setItems] = useState([])

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }
    const { data, error } = useSWR(
        `/api/search/item/word?page=${currentPage}&size=${PAGE_SIZE}&word=${word}`,
        fetcher,
    )

    useEffect(() => {
        if (data) {
            setItems(prevItems => [...prevItems, ...data.data])
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
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.itemBox}>
                            {items
                                ? items.map((item, index) => (
                                      <TimelineItem key={index} item={item} />
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

export default word
