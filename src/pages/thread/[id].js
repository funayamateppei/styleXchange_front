import React from 'react'
import styles from '@/styles/thread.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Link from 'next/link'
import Image from '@/components/Image'
import Slider from '@/components/Slider'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import { useEffect } from 'react'
import axios from '@/lib/axios'

const Thread = ({ id, threadData }) => {
    const { user } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/login',
    })

    // CSRで最新の情報を取得
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/threads/${id}`
    const { data: data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: threadData,
    })
    useEffect(() => {
        mutate()
    }, [])

    if (threadData === null) {
        return (
            <div className={styles.flexContainer}>
                <img src="loading.gif" alt="loading" />
            </div>
        )
    }

    return (
        <>
            <Layout>
                <Header>
                    <Head>
                        <title>Thread</title>
                    </Head>
                    <div className={styles.container}>
                        {/* ページコンテンツ */}
                        <div className={styles.content}>
                            <div className={styles.userInfo}>
                                {data ? (
                                    <Link
                                        href={
                                            data && `/profile/${data.user.id}`
                                        }>
                                        <div className={styles.iconAndName}>
                                            {data?.user?.icon_path ? (
                                                <Image
                                                    src={data.user.icon_path}
                                                    alt="icon"
                                                    style="h-12 w-12 rounded-full border border-gray-400"
                                                />
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-10 h-10 rounded-full border border-gray-800">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                    />
                                                </svg>
                                            )}
                                            <h2>{data && data.user.name}</h2>
                                            <p>{data && data.user.height}cm</p>
                                        </div>
                                    </Link>
                                ) : null}
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className={styles.sliderBox}>
                                {(data && (
                                    <Slider images={data.thread_images} />
                                )) ||
                                    null}
                            </div>
                        </div>
                    </div>
                    <FooterTabBar user={user} />
                </Header>
            </Layout>
        </>
    )
}

export async function getAllThreadIds() {
    const response = await axios.get('/api/threads/ids')
    const threads = await response.data
    return await threads.map(user => {
        return {
            params: {
                id: String(user.id),
            },
        }
    })
}

export async function getStaticPaths() {
    const paths = await getAllThreadIds()
    return {
        paths,
        fallback: true,
    }
}

export async function getThreadData(id) {
    const response = await axios.get(`/api/threads/${id}`)
    const data = await response.data
    return data
}

export async function getStaticProps({ params }) {
    const data = await getThreadData(params.id)
    const id = data.id
    return {
        props: {
            id: id,
            threadData: data,
        },
        revalidate: 3,
    }
}

export default Thread
