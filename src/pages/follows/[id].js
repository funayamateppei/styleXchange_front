import React from 'react'

import styles from '@/styles/follows.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import FollowUserInfo from '@/components/FollowUserInfo'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'

// フォロー欄
// CSR + ISR
const follow = ({ data, id }) => {
    const { user } = useAuth({ middleware: 'guest' })

    // 特定のユーザーのフォロー情報
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/follows/${id}`
    const { data: followData, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: data,
    })
    useEffect(() => {
        mutate()
    }, [])

    // フォロー中表示かフォロワー表示の状態管理
    // trueがフォロワー falseがフォロー中
    const [mode, setMode] = useState(true)
    const modeChangeThread = () => {
        setMode(true)
    }
    const modeChangeItem = () => {
        setMode(false)
    }

    return (
        <Layout>
            <Header>
                <div className={styles.container}>
                    <div className={styles.buttonBox}>
                        <button
                            className={`${styles.modeButton} ${
                                mode === true ? styles.modeChange : ''
                            }`}
                            onClick={modeChangeThread}>
                            <p>フォロワー</p>
                        </button>
                        <button
                            className={`${styles.modeButton} ${
                                mode === false ? styles.modeChange : ''
                            }`}
                            onClick={modeChangeItem}>
                            <p>フォロー中</p>
                        </button>
                    </div>
                    {/* 一覧 */}
                    <div>
                        {mode === true
                            ? followData
                                ? followData.followers.map(x => (
                                      <FollowUserInfo user={x} key={x.id} />
                                  ))
                                : null
                            : followData
                            ? followData.followings.map(x => (
                                  <FollowUserInfo user={x} key={x.id} />
                              ))
                            : null}
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export async function getAllUserIds() {
    const response = await axios.get('/api/userIds')
    const users = await response.data
    return await users.map(user => {
        return {
            params: {
                id: String(user.id),
            },
        }
    })
}

export async function getUserFollowsData(id) {
    const response = await axios.get(`/api/follows/${id}`)
    const data = await response.data
    return data
}

export async function getStaticPaths() {
    const paths = await getAllUserIds()
    return {
        paths,
        fallback: true,
    }
}

export async function getStaticProps({ params }) {
    const data = await getUserFollowsData(params.id)
    return {
        props: {
            id: data.id,
            data,
        },
        revalidate: 3,
    }
}

export default follow
