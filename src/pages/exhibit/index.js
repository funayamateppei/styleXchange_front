import React from 'react'
import styles from '@/styles/exhibit.module.css'
import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import FooterTabBar from '@/components/FooterTabBar'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Exhibit = () => {
    const { user } = useAuth({ middleware: 'guest' })

    // thread text
    const [text, setText] = useState('');
    // thread image
    const [images, setImages] = useState([]);
    // items 複数
    const [items, setItems] = useState([]);

    return (
        <Layout>
            <Head>
                <title>Exhibit</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* ページコンテンツ */}
                    <button>商品を追加ボタン</button>

                </div>
                <FooterTabBar user={user} />
            </div>
        </Layout>
    )
}

export default Exhibit
