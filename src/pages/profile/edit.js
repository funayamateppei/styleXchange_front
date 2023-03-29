import React from 'react'
import styles from '@/styles/profileEdit.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Image from '@/components/Image'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import axios from '@/lib/axios'

const edit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const [formData, setFormData] = useState({
        iconFile: '',
        height: '',
        name: '',
        email: '',
        text: '',
        postcode: '',
        address: '',
        instagramId: '',
    })

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const iconClear = e => {
        e.preventDefault()
        setFormData({ ...formData, iconFile: '' })
    }

    const submit = async e => {
        e.preventDefault()
        // もし全て空欄なら動かさない 保存buttonも一応disabledで対応している
        if (Object.values(formData).every(value => value === '')) {
            console.log('Please fill out the form')
            return
        }

        const data = new FormData()
        for (const [key, value] of Object.entries(formData)) {
            if (value !== '') {
                data.append(key, value)
            }
        }
        try {
            const response = await axios.post('/api/my/data', data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PATCH',
                },
            })
            console.log(response.status)
            if (response.status === 204) {
                window.location.href = '/profile'
            } else {
                setMessage('エラーが発生しました。')
            }
        } catch (error) {
            if (error.response) {
                console.log(
                    `エラーが発生しました。ステータスコード: ${error.response.status}`,
                )
            }
        }
    }

    console.log(formData)

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
                        <form className={styles.form}>
                            <div className={styles.iconBox}>
                                <input
                                    id="icon"
                                    type="file"
                                    accept="image/*"
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            iconFile: e.target.files[0],
                                        })
                                    }
                                    hidden
                                />
                                {user ? (
                                    formData.iconFile ? (
                                        <>
                                            <label htmlFor="icon">
                                                <img
                                                    src={URL.createObjectURL(
                                                        formData.iconFile,
                                                    )}
                                                    className={styles.icon}
                                                />
                                            </label>
                                            <button
                                                className={styles.clearButton}
                                                onClick={iconClear}>
                                                clear
                                            </button>
                                        </>
                                    ) : user.icon_path ? (
                                        <label htmlFor="icon">
                                            <Image
                                                src={user.icon_path}
                                                alt="icon"
                                                style="h-20 w-20 rounded-full border border-gray-400"
                                            />
                                        </label>
                                    ) : (
                                        <label htmlFor="icon">
                                            <img
                                                src="../icon.png"
                                                alt="icon"
                                                className="h-20 w-20 rounded-full border border-gray-400"
                                            />
                                        </label>
                                    )
                                ) : null}
                            </div>

                            <div className={styles.heightBox}>
                                <label htmlFor="height">身長</label>
                                <div>
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        required
                                        placeholder="例 170"
                                        defaultValue={user?.height}
                                        onChange={handleChange}
                                    />
                                    cm
                                </div>
                            </div>

                            <div className={styles.nameBox}>
                                <label htmlFor="name">ユーザー名</label>
                                <div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={user?.name}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.emailBox}>
                                <label htmlFor="email">メールアドレス</label>
                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        defaultValue={user?.email}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.textBox}>
                                <label htmlFor="text">自己紹介</label>
                                <div>
                                    <textarea
                                        type="text"
                                        id="text"
                                        name="text"
                                        defaultValue={user?.text}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.postcodeAddress}>
                                <label htmlFor="address">住所</label>
                                <div className={styles.postcodeBox}>
                                    <label htmlFor="postcode">〒</label>
                                    <div>
                                        <input
                                            type="number"
                                            id="postcode"
                                            name="postcode"
                                            placeholder="例 1234567"
                                            defaultValue={user?.post_code}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className={styles.addressBox}>
                                    <div>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            defaultValue={user?.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.instagramBox}>
                                <label htmlFor="instagram">Instagram id</label>
                                <div>
                                    <input
                                        type="text"
                                        id="instagram"
                                        name="instagramId"
                                        defaultValue={user?.instagram_id}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                className={styles.submitButton}
                                disabled={
                                    Object.values(formData).every(
                                        value => value === '',
                                    )
                                        ? true
                                        : false
                                }
                                onClick={submit}>
                                保存
                            </button>
                        </form>
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export default edit
