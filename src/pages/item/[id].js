import React from 'react'
import styles from '@/styles/item.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Image from '@/components/Image'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'

const Item = () => {
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
                            {/* {data.thread_images.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image.path}
                                    alt="image"
                                />
                                // コンポーネント作成 スライドショー
                            ))} */}
                        </div>
                    </div>
                    <FooterTabBar user={user} />
                </Header>
            </Layout>
        </>
    )
}

export default Item
