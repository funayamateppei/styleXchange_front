import React from 'react'
import styles from '@/styles/profileEdit.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Image from '@/components/Image'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const edit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const [icon, setIcon] = useState()

    return (
        <Layout>
            <Header>
                {/* ページコンテンツ */}
                <Head>
                    <title>Profile Edit</title>
                </Head>
                <div className={styles.container}>
                    {/* ページコンテンツ */}
                    <div className={styles.content}>
                        {user?.icon_path ? (
                            <Image
                                src={user.icon_path}
                                alt="icon"
                                style="h-20 w-20 rounded-full border border-gray-400"
                            />
                        ) : (
                            <img
                                src="../icon.png"
                                alt="icon"
                                className="h-20 w-20 rounded-full border border-gray-400"
                            />
                        )}
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export default edit
