import React from 'react'
import styles from '@/styles/comment.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Image from '@/components/Image'
import Link from 'next/link'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

const ItemComment = ({ id, datalist }) => {
    const { user } = useAuth({ middleware: 'auth' })

    // CSRで最新の情報を取得
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/items/comments/${id}`
    const { data: data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: datalist,
    })
    useEffect(() => {
        mutate()
    }, [])

    // コメントInput更新処理
    const [comment, setComment] = useState('')
    const [message, setMessage] = useState('')
    const handleInputChange = e => {
        setComment(e.target.value)
    }

    // コメント送信処理
    const submit = async () => {
        if (comment !== '') {
            const data = new FormData()
            data.append('comment', comment)
            // API通信
            try {
                const response = await axios.post(
                    `/api/items/comments/${id}`,
                    data,
                )
                if (response.status === 204) {
                    mutate()
                } else {
                    setMessage('エラーが発生しました。')
                }
            } catch (error) {
                if (error.response) {
                    // サーバからエラーレスポンスが返された場合の処理
                    setMessage(
                        `エラーが発生しました。ステータスコード: ${error.response.status}`,
                    )
                } else if (error.request) {
                    // リクエストが送信されたがレスポンスが返ってこなかった場合の処理
                    setMessage('サーバからレスポンスがありませんでした。')
                } else {
                    // その他のエラーが発生した場合の処理
                    setMessage('エラーが発生しました。')
                }
            }
        }
    }
    console.log(datalist)
    if (data === null) {
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
                        <title>Item Comment</title>
                    </Head>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <div className={styles.commentContainer}>
                                {data
                                    ? data.commentData.map((comment, index) => (
                                          <div
                                              key={index}
                                              className={styles.box}>
                                              <Link
                                                  href={
                                                      data &&
                                                      `/profile/${comment.user.id}`
                                                  }>
                                                  <div
                                                      className={
                                                          styles.commentBox
                                                      }>
                                                      {comment?.user
                                                          ?.icon_path ? (
                                                          <Image
                                                              src={
                                                                  comment.user
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
                                                      <p
                                                          className={
                                                              styles.name
                                                          }>
                                                          {comment?.user?.name
                                                              ? comment.user
                                                                    .name
                                                              : null}
                                                      </p>
                                                  </div>
                                              </Link>
                                              <p className={styles.comment}>
                                                  {comment
                                                      ? comment.comment
                                                      : null}
                                              </p>
                                          </div>
                                      ))
                                    : null}
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <p className="text-center text-red-400">{message}</p>
                        <div className={styles.commentInput}>
                            <input
                                type="text"
                                className={styles.input}
                                onChange={handleInputChange}
                            />
                            <button
                                className={styles.submitButton}
                                disabled={comment === '' ? true : false}
                                onClick={submit}>
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
                                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </Header>
            </Layout>
        </>
    )
}

export async function getAllItemIds() {
    const response = await axios.get('/api/items/ids')
    const items = await response.data
    return await items.map(item => {
        return {
            params: {
                id: String(item.id),
            },
        }
    })
}

export async function getStaticPaths() {
    const paths = await getAllItemIds()
    return {
        paths,
        fallback: true,
    }
}

export async function getItemCommentData(id) {
    const response = await axios.get(`/api/items/comments/${id}`)
    const data = await response.data
    return data
}

export async function getStaticProps({ params }) {
    const data = await getItemCommentData(params.id)
    const id = data.itemData.id
    return {
        props: {
            id: id,
            datalist: data,
        },
        revalidate: 3,
    }
}

export default ItemComment
