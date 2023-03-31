import React from 'react'
import styles from '@/styles/profile.module.css'
import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import FooterTabBar from '@/components/FooterTabBar'
import ProfileItem from '@/components/ProfileItem'
import FollowButton from '@/components/FollowButton'
import Link from 'next/link'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'

const User = ({ id, data }) => {
    const { user } = useAuth({ middleware: 'auth' })

    const router = useRouter()

    // CSRで最新の情報を取得
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/user/${id}`
    const { data: userData, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: data,
    })
    useEffect(() => {
        mutate()
    }, [])

    const followSubmit = async () => {
        // API通信
        try {
            const response = await axios.post(`/api/follows/${userData.id}`)
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

    if (userData) {
        if (user) {
            if (userData.id === user.id) {
                router.push('/profile')
            }
        }
    }

    if (userData === null) {
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
                        <title>Profile</title>
                    </Head>
                    <div className={styles.marginTop}>
                        <div className={styles.container}>
                            {/* ページコンテンツ */}
                            <div className={styles.content}>
                                {userData?.icon_path ? (
                                    <div className="w-28 h-20 rounded-full overflow-hidden border border-gray-400">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${userData.icon_path}`}
                                            alt="icon"
                                            className="w-full h-full object-cover mx-auto my-auto"
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src="../icon.png"
                                        alt="icon"
                                        className="rounded-full border border-gray-400 h-20 w-20"
                                    />
                                )}
                                <div className={styles.follow}>
                                    <Link href={`/follows/${id}`}>
                                        <div className={styles.box}>
                                            <h2 className={styles.bold}>
                                                {userData
                                                    ? userData.follower_count
                                                    : null}
                                            </h2>
                                            <p>フォロワー</p>
                                        </div>
                                    </Link>
                                    <Link href={`/follows/${id}`}>
                                        <div className={styles.box}>
                                            <h2 className={styles.bold}>
                                                {userData
                                                    ? userData.following_count
                                                    : null}
                                            </h2>
                                            <p>フォロー中</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className={styles.userInfo}>
                                <div>
                                    <h2 className={styles.bold}>{data.name}</h2>
                                    <p>{userData ? userData.height : null}cm</p>
                                    {userData.instagram_id ? (
                                        <a
                                            href={`https://www.instagram.com/${data.instagram_id}`}
                                            rel="noreferrer noopener"
                                            target="_blank">
                                            <img
                                                src="/Instagram_Glyph_Gradient_RGB.svg"
                                                alt="instagram icon"
                                                className="w-7 h-7 ml-4"
                                            />
                                        </a>
                                    ) : null}
                                </div>
                                <p className={styles.smallText}>
                                    {userData ? userData.text : null}
                                </p>
                            </div>

                            {user ? (
                                <FollowButton
                                    data={{
                                        ...userData,
                                        is_following: userData.followers.some(
                                            follower => follower.id === user.id,
                                        ),
                                    }}
                                    onClick={followSubmit}
                                />
                            ) : null}

                            {/* 投稿一覧 */}
                            {userData ? (
                                <div className={styles.threads}>
                                    <ProfileItem data={userData} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </Header>
                <FooterTabBar user={user} />
            </Layout>
        </>
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

export async function getStaticPaths() {
    const paths = await getAllUserIds()
    return {
        paths,
        fallback: true,
    }
}

export async function getUserData(id) {
    const response = await axios.get(`/api/user/${id}`)
    const data = await response.data
    return data
}

export async function getStaticProps({ params }) {
    const data = await getUserData(params.id)
    const id = data.id
    return {
        props: {
            id: id,
            data,
        },
        revalidate: 3,
    }
}

export default User
