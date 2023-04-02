import React from 'react'
import styles from '@/styles/LikeAndBookmark.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Thread from '@/components/Thread'
import Item from '@/components/Item'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

const like = () => {
    useAuth({ middleware: 'auth' })

    const [isThreadSelected, setIsThreadSelected] = useState(1)

    const PAGE_SIZE = 15

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

    // dataが書き変わったらitemsに取得したデータを追加する
    useEffect(() => {
        if (data) {
            setItems(prevItems => [...prevItems, ...data.data])
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

    if (isLoading) {
        return (
            <div className={styles.flexContainer}>
                <img src="/loading.gif" alt="loading" />
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.flexContainer}>
                <p>エラーが発生しました</p>
            </div>
        )
    }

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
                                onClick={() => {
                                    setIsThreadSelected(1)
                                    setItems([])
                                    setCurrentPage(0)
                                    window.scrollTo(0, 0)
                                }}>
                                コーデ
                            </button>
                            <button
                                disabled={isThreadSelected ? 0 : 1}
                                onClick={() => {
                                    setIsThreadSelected(0)
                                    setItems([])
                                    setCurrentPage(0)
                                    window.scrollTo(0, 0)
                                }}>
                                アイテム
                            </button>
                        </div>

                        <div className={styles.itemsContainer}>
                            {items && items.length !== 0
                                ? isThreadSelected === 1
                                    ? items.map(item => (
                                          <Thread item={item} key={item.id} />
                                      ))
                                    : items.map(item => (
                                          <Item item={item} key={item.id} />
                                      ))
                                : null}
                            {data
                                ? !data.next_page_url && (
                                      <div className={styles.noMoreData}>
                                          これ以上ありません
                                      </div>
                                  )
                                : null}
                        </div>
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export default like
