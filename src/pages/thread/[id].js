import React from 'react'
import styles from '@/styles/thread.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Image from '@/components/Image'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'

const Thread = ({ id, data }) => {
    // console.log(id)
    console.log(data)
    const { user } = useAuth({ middleware: 'auth' })
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
                            {(data &&
                                data.thread_images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image.path}
                                        alt="image"
                                    />
                                    // コンポーネント作成 スライドショー
                                ))) ||
                                null}
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
            data,
        },
        revalidate: 3,
    }
}

export default Thread
