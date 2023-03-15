import React from 'react'

import styles from '@/styles/follows.module.css'
import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import FollowUserInfo from '@/components/FollowUserInfo'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'

// フォロー欄
const follow = ({ data, id }) => {
    const { user } = useAuth({ middleware: 'guest' })

    // CSRで最新の情報を取得
    // (フォロー / アンフォロー関数でmutateを使うことで最新の情報にできる)
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/follows/${id}`
    const { data: userData, mutate } = useSWR(apiUrl, fetcher, {
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
                            ? userData && userData.followers
                                ? userData.followers.map(x =>
                                      user ? (
                                          <FollowUserInfo
                                              auth={user.id}
                                              user={{
                                                  ...x,
                                                  is_following: x.followers.some(
                                                      follower =>
                                                          follower.id ===
                                                          user.id,
                                                  ),
                                              }}
                                              key={x.id}
                                          />
                                      ) : null,
                                  )
                                : null
                            : userData && userData.followings
                            ? userData.followings.map(x =>
                                  user ? (
                                      <FollowUserInfo
                                          auth={user.id}
                                          user={{
                                              ...x,
                                              is_following: x.followers.some(
                                                  follower =>
                                                      follower.id === user.id,
                                              ),
                                          }}
                                          key={x.id}
                                      />
                                  ) : null,
                              )
                            : null}
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { req, res } = context
    const { id } = context.params // 動的なidを取得
    try {
        const response = await axios.get(`/api/follows/${id}`, {
            withCredentials: true,
            headers: {
                Cookie: `graduation_back_session=${req.headers.cookie.graduation_back_session}; XSRF-TOKEN=${req.headers.cookie['XSRF-TOKEN']}`,
            },
        })
        return {
            props: {
                data: response.data,
                id: id,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

// CSR+ISRの残骸

// export async function getAllUserIds() {
//     const response = await axios.get('/api/userIds')
//     const users = await response.data
//     return await users.map(user => {
//         return {
//             params: {
//                 id: String(user.id),
//             },
//         }
//     })
// }

// export async function getUserFollowsData(id) {
//     const response = await axios.get(`/api/follows/${id}`)
//     const data = await response.data
//     return data
// }

// export async function getStaticPaths() {
//     const paths = await getAllUserIds()
//     return {
//         paths,
//         fallback: true,
//     }
// }

// export async function getStaticProps({ params }) {
//     const data = await getUserFollowsData(params.id)
//     return {
//         props: {
//             id: data.id,
//             data,
//         },
//         revalidate: 3,
//     }
// }

export default follow
