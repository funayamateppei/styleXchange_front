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
import ExhibitItem from '@/components/ItemExhibit'

const Exhibit = ({ secondCategories, thirdCategories }) => {
    const { user } = useAuth({ middleware: 'auth' })

    // エラーメッセージ
    const [message, setMessage] = useState('')

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
            url: '',
            images: [],
        },
    ])

    // 送信中かどうか
    const [isSubmitting, setIsSubmitting] = useState(false)

    // console.log(forms)
    // ThreadImages更新関数
    const handleThreadImageChange = e => {
        const files = Array.from(e.target.files)
        if (files.length <= 6) {
            setThreadImages([...threadImages, ...files])
        } else {
            alert('画像は6枚までしか選択できません')
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
                url: '',
                images: [],
            },
        ])
    }

    // フォーム更新の関数
    const handleFormChange = (index, form) => {
        const newForms = [...forms] // 親コンポーネントで管理しているStateコピー
        newForms[index] = form // コピー(配列)のindex番目のformデータを返り値で更新
        setForms(newForms)
    }

    // フォーム削除の関数
    const handleDeleteForm = index => {
        const newForms = [...forms]
        newForms.splice(index, 1)
        setForms(newForms)
    }

    // 画像をリサイズする関数
    const compressImage = async image => {
        const maxSizeInBytes = 1 * 1024 * 1024 // 1MBの制限
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = URL.createObjectURL(image)
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                let width = img.width
                let height = img.height
                canvas.width = width
                canvas.height = height
                // 画像を描画
                ctx.drawImage(img, 0, 0, width, height)
                // ファイルサイズが制限を超えている場合にリサイズする
                if (image.size > maxSizeInBytes) {
                    const scaleFactor = Math.sqrt(maxSizeInBytes / image.size)
                    width *= scaleFactor
                    height *= scaleFactor
                    canvas.width = width
                    canvas.height = height
                    ctx.drawImage(img, 0, 0, width, height)
                }
                // 圧縮した画像データを取得
                canvas.toBlob(
                    blob => {
                        const compressedImage = new File([blob], image.name, {
                            type: 'image/jpeg',
                        })
                        resolve(compressedImage)
                    },
                    'image/jpeg',
                    0.8, // 画質を調整する場合は、0.8のような値を指定してください
                )
            }
            img.onerror = error => {
                reject(error)
            }
        })
    }

    // 送信する関数
    const submit = async e => {
        e.preventDefault()
        setIsSubmitting(true)
        const data = new FormData()
        data.append('thread[user_id]', user.id)
        data.append('thread[text]', threadText)
        // 画像ファイルをリサイズして追加
        const resizedThreadImages = await Promise.all(
            threadImages.map(image => compressImage(image)),
        )
        resizedThreadImages.forEach((image, index) => {
            data.append(`threadImages[${index}]`, image)
        })
        await Promise.all(
            forms.map(async (item, index) => {
                data.append(`items[${index}][title]`, item.title)
                data.append(`items[${index}][text]`, item.text)
                data.append(`items[${index}][price]`, item.price)
                data.append(`items[${index}][gender]`, Number(item.gender))
                data.append(`items[${index}][category_id]`, item.category_id)
                data.append(`items[${index}][color]`, item.color)
                data.append(`items[${index}][size]`, item.size)
                data.append(`items[${index}][condition]`, item.condition)
                data.append(`items[${index}][days]`, item.days)
                data.append(`items[${index}][postage]`, Number(item.postage))
                data.append(`items[${index}][url]`, item.url)
                // 画像ファイルをリサイズして追加
                const resizedItemImages = await Promise.all(
                    item.images.map(image => compressImage(image)),
                )
                resizedItemImages.forEach((image, i) => {
                    data.append(`items[${index}][images][${i}]`, image) // items配列のimages配列に画像ファイル格納
                })
                // console.log(resizedItemImages)
                console.log(...data.entries())
            }),
        )
        // API通信
        try {
            const response = await axios.post('/api/exhibit', data, {
                headers: { 'content-type': 'multipart/form-data' },
            })
            console.log(response.status)
            if (response.status === 204) {
                window.location.href = '/profile'
            } else {
                setMessage('エラーが発生しました。')
            }
        } catch (error) {
            if (error.response) {
                setIsSubmitting(false)
                // サーバからエラーレスポンスが返された場合の処理
                setMessage(
                    `エラーが発生しました。ステータスコード: ${error.response.status}`,
                )
            } else if (error.request) {
                // リクエストが送信されたがレスポンスが返ってこなかった場合の処理
                setMessage('サーバからレスポンスがありませんでした。')
            } else {
                // その他のエラーが発生した場合の処理
                setMessage('エラーが発生しました。')
            }
        }
    }

    if (isSubmitting === true) {
        return (
            <div className={styles.flexContainer}>
                <p>送信中</p>
                <img src="loading.gif" alt="loading" />
            </div>
        )
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
                                length: 6 - threadImages.length,
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
                                <ExhibitItem
                                    key={index}
                                    index={index}
                                    form={form}
                                    secondCategories={secondCategories}
                                    thirdCategories={thirdCategories}
                                    onChange={event =>
                                        handleFormChange(index, event)
                                    }
                                    onDelete={handleDeleteForm}
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
                        <p className={styles.errorText}>{message}</p>
                        <button
                            className={styles.exhibitButton}
                            disabled={
                                !forms.every(
                                    form =>
                                        form.title &&
                                        form.price &&
                                        form.price >= 300 &&
                                        form.gender !== '' &&
                                        form.category_id &&
                                        form.size &&
                                        form.condition &&
                                        form.days &&
                                        form.url,
                                )
                            }
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
