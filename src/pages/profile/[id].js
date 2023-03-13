import React from 'react'
import styles from '@/styles/profile.module.css'
import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import FooterTabBar from '@/components/FooterTabBar'
import Image from '@/components/Image'
import ProfileItem from '@/components/ProfileItem'
import FollowButton from '@/components/FollowButton'
import Link from 'next/link'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import { useEffect } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

const User = ({ id, data }) => {
    const { user } = useAuth({ middleware: 'auth' })

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
                        <title>Profile</title>
                    </Head>
                    <div className={styles.container}>
                        {/* ページコンテンツ */}
                        <div className={styles.content}>
                            {data?.icon_path ? (
                                <Image
                                    src={data.icon_path}
                                    alt="icon"
                                    style="rounded-full border border-gray-400 h-20 w-20"
                                />
                            ) : (
                                <img
                                    src="../icon.png"
                                    alt="icon"
                                    className="rounded-full border border-gray-400 h-20 w-20"
                                />
                            )}

                            <div className={styles.follow}>
                                <Link href={`/follows/${data.id}`}>
                                    <div className={styles.box}>
                                        <h2 className={styles.bold}>
                                            {data.follower_count}
                                        </h2>
                                        <p>フォロワー</p>
                                    </div>
                                </Link>
                                <Link href={`/follows/${data.id}`}>
                                    <div className={styles.box}>
                                        <h2 className={styles.bold}>
                                            {data.following_count}
                                        </h2>
                                        <p>フォロー中</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className={styles.userInfo}>
                            <h2 className={styles.bold}>{data.name}</h2>
                            <p className={styles.smallText}>{data.text}</p>
                        </div>

                        {user ? (
                            <FollowButton
                                data={{
                                    ...userData,
                                    is_following: userData.followers.some(
                                        follower => follower.id === user.id,
                                    ),
                                }}
                            />
                        ) : null}

                        {/* 投稿一覧 */}
                        <div className={styles.threads}>
                            <ProfileItem data={data} />
                        </div>
                    </div>
                    <FooterTabBar user={user} />
                </Header>
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

export async function getUserData(id) {
    const response = await axios.get(`/api/user/${id}`)
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
    const data = await getUserData(params.id)
    return {
        props: {
            id: data.id,
            data,
        },
        revalidate: 3,
    }
}

export default User
