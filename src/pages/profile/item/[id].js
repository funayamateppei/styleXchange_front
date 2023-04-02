import React from 'react'
import styles from '@/styles/edit.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'

const item = ({ id, data }) => {
    const { user } = useAuth({ middleware: 'auth' })
    console.log(data)
    return (
        <Layout>
            <Header>
                <div className={styles.container}>
                    <div className={styles.content}></div>
                </div>
            </Header>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { req, res } = context
    const { id } = context.params // 動的なidを取得
    try {
        const response = await axios.get(`/api/items/${id}`, {
            withCredentials: true,
            headers: {
                Cookie: `graduation_back_session=${req.headers.cookie.graduation_back_session}; XSRF-TOKEN=${req.headers.cookie['XSRF-TOKEN']}`,
            },
        })
        return {
            props: {
                data: response.data,
                id: id,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default item
