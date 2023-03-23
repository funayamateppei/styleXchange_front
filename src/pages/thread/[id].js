import React from 'react'
import styles from '@/styles/thread.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Link from 'next/link'
import Image from '@/components/Image'
import Slider from '@/components/Slider'
import ThreadItem from '@/components/ThreadItem'
import ThreadImage from '@/components/ThreadImage'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import { useEffect } from 'react'
import axios from '@/lib/axios'

const Thread = ({ id, threadData }) => {
    const { user } = useAuth({
        middleware: 'auth',
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

    // コメントを日付順で並び替え
    let comments = []
    if (data) {
        if (data.comment) {
            comments = data.thread_comments.sort(function (a, b) {
                if (a.created_at < b.created_at) return -1
                if (a.created_at > b.created_at) return 1
                return 0
            })
        }
    }

    // 関連する投稿の情報を取得し、表示している投稿を削除する
    let relativeThreads = []
    if (data) {
        if (data.user.threads) {
            data.user.threads.filter(function (thread) {
                if (thread.id !== data.id) {
                    relativeThreads.push(thread)
                }
            })
        }
    }

    // console.log(data)

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
                                            <h2>
                                                {data ? data.user.name : null}
                                            </h2>
                                            <p>
                                                {data ? data.user.height : null}
                                                cm
                                            </p>
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
                                <div className={styles.statusBox}>
                                    <div className={styles.statusButton}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="rgb(255, 100, 100)"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className={`${styles.statusButton} ml-2`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="rgb(255, 100, 100)"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={styles.statusCountBox}>
                                    <div className={styles.statusCount}>
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
                                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                            />
                                        </svg>
                                        <p>
                                            {data
                                                ? data.bookmarked_threads
                                                    ? data.bookmarked_threads
                                                          .length
                                                    : 0
                                                : 0}
                                        </p>
                                    </div>
                                    <div
                                        className={`${styles.statusCount} ml-5`}>
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
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                        <p>
                                            {data
                                                ? data.liked_threads
                                                    ? data.liked_threads.length
                                                    : 0
                                                : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.itemsContainer}>
                                <h2>販売中のアイテム</h2>
                                <div className={styles.itemsBox}>
                                    {data
                                        ? data.items.map((item, index) => (
                                              <ThreadItem
                                                  key={index}
                                                  item={item}
                                              />
                                          ))
                                        : null}
                                </div>
                            </div>

                            <div className={styles.textContainer}>
                                <h2>{data ? data.text : null}</h2>
                                <div className={styles.commentsTitle}>
                                    コメント一覧
                                </div>
                                <div className={styles.commentContainer}>
                                    {comments
                                        ? comments
                                              .slice(0, 2)
                                              .map((commentData, index) => (
                                                  <div key={index}>
                                                      <div
                                                          className={
                                                              styles.commentBox
                                                          }>
                                                          {commentData?.user
                                                              ?.icon_path ? (
                                                              <Image
                                                                  src={
                                                                      commentData
                                                                          .user
                                                                          .icon_path
                                                                  }
                                                                  alt="icon"
                                                                  style="h-12 w-12 rounded-full border border-gray-400"
                                                              />
                                                          ) : (
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  strokeWidth={
                                                                      1.5
                                                                  }
                                                                  stroke="currentColor"
                                                                  className="w-10 h-10 rounded-full border border-gray-800">
                                                                  <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                                  />
                                                              </svg>
                                                          )}
                                                          <p
                                                              className={
                                                                  styles.name
                                                              }>
                                                              {
                                                                  commentData
                                                                      .user.name
                                                              }
                                                          </p>
                                                      </div>
                                                      <p
                                                          className={
                                                              styles.comment
                                                          }>
                                                          {commentData.comment}
                                                      </p>
                                                  </div>
                                              ))
                                        : null}
                                    {comments ? (
                                        comments.length >= 2 ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 m-2 text-gray-500">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                                />
                                            </svg>
                                        ) : null
                                    ) : null}
                                    {data ? (
                                        <Link
                                            href={`/thread/comment/${data.id}`}>
                                            <button
                                                className={
                                                    styles.commentMoreButton
                                                }>
                                                MORE
                                            </button>
                                        </Link>
                                    ) : null}
                                </div>
                            </div>

                            {relativeThreads ? (
                                relativeThreads ? (
                                    relativeThreads.length !== 0 ? (
                                        <h2 className="font-bold">
                                            この人の他の投稿
                                        </h2>
                                    ) : null
                                ) : null
                            ) : null}
                            <div className={styles.relativeContainer}>
                                {relativeThreads
                                    ? relativeThreads
                                        ? relativeThreads
                                              .slice(0, 3)
                                              .map((thread, index) => (
                                                  <div
                                                      key={index}
                                                      className={styles.item}>
                                                      <Link
                                                          href={`/thread/${thread.id}`}>
                                                          <ThreadImage
                                                              src={
                                                                  thread
                                                                      .thread_images[0]
                                                                      .path
                                                              }
                                                              alt="image"
                                                          />
                                                      </Link>
                                                  </div>
                                              ))
                                        : null
                                    : null}
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
