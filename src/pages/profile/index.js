import styles from '@/styles/profile.module.css'
import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import FooterTabBar from '@/components/FooterTabBar'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import Button from '@/components/Button'
import Link from 'next/link'
import ProfileItem from '@/components/ProfileItem'

const profile = () => {
    useAuth({ middleware: 'auth' })

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }
    const apiUrl = `/api/my/data`
    const { data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: null,
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
            <AppLayout user={data}>
                <Head>
                    <title>Profile</title>
                </Head>
                <div className={styles.container}>
                    {/* ページコンテンツ */}
                    <div className={styles.content}>
                        {data?.icon_path ? (
                            <div className="w-28 h-20 rounded-full overflow-hidden border border-gray-400">
                                <img
                                    // src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.icon_path}`}
                                    src={`${process.env.NEXT_PUBLIC_AWS_URL}${data.icon_path}`}
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
                        <div>
                            <h2 className={styles.bold}>{data.name}</h2>
                            <p>{data.height ? data.height + ' cm' : null}</p>
                            {data.instagram_id ? (
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
                        <p className={styles.smallText}>{data.text}</p>
                    </div>

                    <Link href={'/profile/edit'}>
                        <Button type="button">プロフィールを編集</Button>
                    </Link>

                    {/* 投稿一覧 */}
                    <div className={styles.threads}>
                        <ProfileItem data={data} />
                    </div>
                </div>
                <FooterTabBar user={data} />
            </AppLayout>
        </>
    )
}

export default profile
