import React from 'react'

import styles from '@/styles/follows.module.css'
import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import FollowUserInfo from '@/components/FollowUserInfo'
import FollowButton from '@/components/FollowButton'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'

// フォロー欄
const follow = () => {
    const { user } = useAuth({ middleware: 'guest' })

    const router = useRouter()
    // パスパラメータから値を取得
    const { id } = router.query

    // CSRで最新の情報を取得
    // (フォロー / アンフォロー関数でmutateを使うことで最新の情報にできる)
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }
    const apiUrl = `/api/follows/${id}`
    const { data: userData, mutate } = useSWR(apiUrl, fetcher)
    useEffect(() => {
        mutate()
    }, [])

    const followSubmit = async id => {
        // API通信
        try {
            const response = await axios.post(`/api/follows/${id}`)
            if (response.status === 204) {
                console.log('success')
                mutate()
            }
        } catch (error) {
            if (error.response) {
                // サーバからエラーレスポンスが返された場合の処理
                console.log('failed')
            }
        }
    }

    // フォロー中表示かフォロワー表示の状態管理
    // trueがフォロワー falseがフォロー中
    const [mode, setMode] = useState(true)
    const modeChangeThread = () => {
        setMode(true)
    }
    const modeChangeItem = () => {
        setMode(false)
    }

    // console.log(userData)

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
                    <div className={styles.userBox}>
                        {mode === true
                            ? userData && userData.followers
                                ? userData.followers.map(x =>
                                      user ? (
                                          <div
                                              className={styles.flex}
                                              key={x.id}>
                                              <FollowUserInfo user={x} />
                                              {x.id !== user.id ? (
                                                  <FollowButton
                                                      data={{
                                                          ...x,
                                                          is_following: x.followers.some(
                                                              follower =>
                                                                  follower.id ===
                                                                  user.id,
                                                          ),
                                                      }}
                                                      onClick={() =>
                                                          followSubmit(x.id)
                                                      }
                                                  />
                                              ) : null}
                                          </div>
                                      ) : null,
                                  )
                                : null
                            : userData && userData.followings
                            ? userData.followings.map(x =>
                                  user ? (
                                      <div className={styles.flex} key={x.id}>
                                          <FollowUserInfo user={x} />
                                          {x.id !== user.id ? (
                                              <FollowButton
                                                  data={{
                                                      ...x,
                                                      is_following: x.followers.some(
                                                          follower =>
                                                              follower.id ===
                                                              user.id,
                                                      ),
                                                  }}
                                                  onClick={() =>
                                                      followSubmit(x.id)
                                                  }
                                              />
                                          ) : null}
                                      </div>
                                  ) : null,
                              )
                            : null}
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

// export async function getServerSideProps(context) {
//     const { req, res } = context
//     const { id } = context.params // 動的なidを取得
//     try {
//         const response = await axios.get(`/api/follows/${id}`, {
//             withCredentials: true,
//             headers: {
//                 Cookie: `graduation_back_session=${req.headers.cookie.graduation_back_session}; XSRF-TOKEN=${req.headers.cookie['XSRF-TOKEN']}`,
//             },
//         })
//         return {
//             props: {
//                 data: response.data,
//                 id: id,
//             },
//         }
//     } catch (error) {
//         console.error(error)
//         return {
//             notFound: true,
//         }
//     }
// }

export default follow
