import React from 'react'
import styles from '@/styles/exhibit.module.css'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

import Layout from '@/components/Layouts/Layout'
import FooterTabBar from '@/components/FooterTabBar'
import ExhibitImage from '@/components/ExhibitImage'
import ExhibitDefaultImage from '@/components/ExhibitDefaultImage'
import Textarea from '@/components/Textarea'

const Exhibit = () => {
    const { user } = useAuth({ middleware: 'guest' })

    // thread image
    const [threadImages, setThreadImages] = useState([])
    // thread text
    const [threadText, setThreadText] = useState('')

    // items 複数
    const [items, setItems] = useState([])

    // ThreadImages更新関数
    const handleThreadImageChange = e => {
        const files = Array.from(e.target.files)
        if (files.length <= 10) {
            setThreadImages([...threadImages, ...files])
        } else {
            alert('画像は10枚までしか選択できません')
        }
    }

    // ThreadImages削除関数
    const handleDeleteThreadImage = index => {
        const newThreadImages = [...threadImages] // 画像配列のコピーを作成
        newThreadImages.splice(index, 1) // 指定されたインデックスの画像を削除
        setThreadImages(newThreadImages) // 画像配列を更新
    }

    // ThreadText更新関数
    const handleChangeThreadText = e => {
        setThreadText(e.target.value)
        console.log(threadText)
    }

    return (
        <Layout>
            <Head>
                <title>Exhibit</title>
            </Head>
            <div className={styles.header}>
                <h1>商品の情報を入力</h1>
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* ページコンテンツ */}
                    <div className={styles.formName}>
                        <h2>コーディネート投稿</h2>
                        <p>必須</p>
                    </div>
                    <input
                        id="threadImageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleThreadImageChange}
                        hidden
                        required
                    />
                    <div className={styles.imageContainer}>
                        {threadImages.map((image, index) => (
                            <ExhibitImage
                                key={index}
                                index={index}
                                src={URL.createObjectURL(image)}
                                onDelete={() => handleDeleteThreadImage(index)}
                            />
                        ))}
                        {Array.from({
                            length: 10 - threadImages.length,
                        }).map((defaultImage, index) => (
                            <label
                                htmlFor="threadImageInput"
                                className="cursor-pointer"
                                key={index + threadImages.length}>
                                <ExhibitDefaultImage
                                    index={index + threadImages.length}
                                    src="default.jpg"
                                />
                            </label>
                        ))}
                    </div>
                    <div className={styles.textareaBox}>
                        <Textarea
                            onChange={e => {
                                handleChangeThreadText(e)
                            }}
                            placeholder="キャプションを入力"
                        />
                    </div>
                </div>
            </div>
            <FooterTabBar user={user} />
        </Layout>
    )
}

export default Exhibit
