import styles from '@/styles/profile.module.css'
import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import FooterTabBar from '@/components/FooterTabBar'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect } from 'react'

const profile = () => {
    useAuth({ middleware: 'auth' })

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
                    <div className={styles.content}>
                        {/* ページコンテンツ */}
                        
                    </div>
                    <FooterTabBar user={data} />
                </div>
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
