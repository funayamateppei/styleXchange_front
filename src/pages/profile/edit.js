import React from 'react'
import styles from '@/styles/profileEdit.module.css'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import Image from '@/components/Image'
import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'

const edit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const router = useRouter()

    return (
        <Layout>
            <Header>
                {/* ページコンテンツ */}
                <div>
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
            </Header>
        </Layout>
    )
}

export default edit
