import styles from '@/styles/profile.module.css'
import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import FooterTabBar from '@/components/FooterTabBar'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import Image from '@/components/Image'
import Button from '@/components/Button'
import Link from 'next/link'
import ProfileItem from '@/components/ProfileItem'

const profile = () => {
    useAuth({ middleware: 'auth' })

    // CSRで最新の情報を取得
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/my/data`
    const { data: data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: null,
    })
    useEffect(() => {
        mutate()
    }, [])
    console.log(data)

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
                            <Image
                                src={data.icon_path}
                                alt="icon"
                                style="rounded-full border border-gray-400 h-20 w-20"
                            />
                        ) : (
                            <img
                                src="icon.png"
                                alt="icon"
                                className="rounded-full border border-gray-400 h-20 w-20"
                            />
                        )}

                        <div className={styles.follow}>
                            <div className={styles.box}>
                                <h2 className={styles.bold}>
                                    {data.follower_count}
                                </h2>
                                <p>フォロワー</p>
                            </div>
                            <div className={styles.box}>
                                <h2 className={styles.bold}>
                                    {data.following_count}
                                </h2>
                                <p>フォロー中</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.userInfo}>
                        <h2>{data.name}</h2>
                        <p>{data.text}</p>
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

// export async function getServerSideProps({ req }) {
//     // cookie から認証情報を取得する
//     let data = {}
//     try {
//         const response = await axios.get('/api/my/data/me', {
//             headers: {
//                 origin: 'localhost',
//                 Authorization: req.headers.cookie,
//                 // Cookie: req.headers.cookie,
//             },
//         })
//         data = response.data
//     } catch (error) {
//         console.error(error.message)
//     }
//     return {
//         props: {
//             data,
//         },
//         revalidate: 3,
//     }
// }

export default profile
