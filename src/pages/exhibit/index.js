import React from 'react'
import styles from '@/styles/exhibit.module.css'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import axios from '@/lib/axios'

import Layout from '@/components/Layouts/Layout'
import FooterTabBar from '@/components/FooterTabBar'
import ExhibitImage from '@/components/ExhibitImage'
import ExhibitDefaultImage from '@/components/ExhibitDefaultImage'
import Textarea from '@/components/Textarea'
import ItemExhibit from '@/components/ItemExhibit'

const Exhibit = ({ secondCategories, thirdCategories }) => {
    const { user } = useAuth({ middleware: 'auth' })

    // thread image
    const [threadImages, setThreadImages] = useState([])
    // thread text
    const [threadText, setThreadText] = useState('')

    // items 複数
    const [forms, setForms] = useState([
        {
            title: '',
            text: '',
            price: '',
            gender: '',
            category_id: '',
            color: '',
            size: '',
            condition: '',
            days: '',
            postage: true,
            images: [],
        },
    ])

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
    }

    // フォーム追加の関数
    const handleAddForm = e => {
        e.preventDefault()
        setForms([
            ...forms,
            {
                title: '',
                text: '',
                price: '',
                gender: '',
                category_id: '',
                color: '',
                size: '',
                condition: '',
                days: '',
                postage: true,
                images: [],
            },
        ])
    }

    const handleFormChange = (index, form) => {
        const newForms = [...forms] // 親コンポーネントで管理しているStateコピー
        newForms[index] = form // コピー(配列)のindex番目のformデータを返り値で更新
        setForms(newForms)
    }

    const submit = async e => {
        e.preventDefault()
        const data = new FormData()
        data.append('thread[user_id]', user.id)
        data.append('thread[text]', threadText)
        data.append('thread[archive]', Number(true))
        threadImages.forEach(image => {
            data.append('threadImages[]', image)
        })
        forms.map((item, index) => {
            data.append(`items[${index}][title]`, item.title)
            data.append(`items[${index}][text]`, item.text)
            data.append(`items[${index}][price]`, item.price)
            data.append(`items[${index}][gender]`, item.gender)
            data.append(`items[${index}][category_id]`, item.category_id)
            data.append(`items[${index}][color]`, item.color)
            data.append(`items[${index}][size]`, item.size)
            data.append(`items[${index}][condition]`, item.condition)
            data.append(`items[${index}][days]`, item.days)
            data.append(`items[${index}][postage]`, item.postage)
            item.images.forEach((image, i) => {
                data.append(`items[${index}][images][${i}]`, image)
            })
        })
        const response = await axios.post('/api/exhibit', data, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        })
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
                    <div className={styles.threadImagesContainer}>
                        <div className={styles.imageContainer}>
                            {threadImages.map((image, index) => (
                                <ExhibitImage
                                    key={index}
                                    index={index}
                                    src={URL.createObjectURL(image)}
                                    onDelete={() =>
                                        handleDeleteThreadImage(index)
                                    }
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
                    </div>
                    <div className={styles.textareaBox}>
                        <Textarea
                            onChange={e => {
                                handleChangeThreadText(e)
                            }}
                            placeholder="キャプションを入力"
                        />
                    </div>

                    <div className={styles.itemContainer}>
                        <div className={styles.itemCardContainer}>
                            {forms.map((form, index) => (
                                <ItemExhibit
                                    key={index}
                                    index={index}
                                    form={form}
                                    secondCategories={secondCategories}
                                    thirdCategories={thirdCategories}
                                    onChange={event =>
                                        handleFormChange(index, event)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div className={styles.buttonBox}>
                        <button
                            className={styles.itemCardButton}
                            onClick={handleAddForm}>
                            アイテム追加
                        </button>
                        <button
                            className={styles.exhibitButton}
                            // disabled={
                            //     !forms.every(
                            //         form =>
                            //             form.title &&
                            //             form.text &&
                            //             form.price &&
                            //             form.price < 300 &&
                            //             form.gender &&
                            //             form.category_id &&
                            //             form.size &&
                            //             form.condition &&
                            //             form.days,
                            //     )
                            // }
                            onClick={submit}>
                            出品
                        </button>
                    </div>
                </div>
            </div>
            <FooterTabBar user={user} />
        </Layout>
    )
}

// カテゴリを全て取得
export async function getStaticProps() {
    const response = await axios.get('/api/categories')
    const categories = await response.data
    const secondCategories = await categories.filter(
        category => category.big_category == 1,
    )
    const thirdCategories = await categories.filter(
        category => category.big_category == 0,
    )
    return {
        props: {
            secondCategories,
            thirdCategories,
        },
        revalidate: 3,
    }
}

export default Exhibit
