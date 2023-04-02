import React from 'react'
import styles from '@/styles/edit.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import ExhibitImage from '@/components/ExhibitImage'
import ExhibitDefaultImage from '@/components/ExhibitDefaultImage'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import axios from '@/lib/axios'

const thread = ({ id, data }) => {
    const { user } = useAuth({ middleware: 'auth' })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [threadData, setThreadData] = useState({
        text: data.text || '',
        thread_images: data.thread_images || [],
        deletedImageIds: [],
        newImages: [],
    })
    console.log(threadData)

    const handleTextChange = e => {
        setThreadData({
            ...threadData,
            text: e.target.value,
        })
    }

    const handleThreadImageChange = e => {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => file)
        if (threadData.thread_images.length + newImages.length > 6) {
            alert('画像は6枚までしかアップロードできません。')
            return
        }
        setThreadData({
            ...threadData,
            newImages: newImages,
        })
    }
    const handleDeleteNewImage = (e, index) => {
        e.preventDefault()
        const updatedImages = [...threadData.newImages]
        updatedImages.splice(index, 1)
        setThreadData({
            ...threadData,
            newImages: updatedImages,
        })
    }

    const handleDeleteImage = (e, imageId) => {
        e.preventDefault()
        setThreadData({
            ...threadData,
            thread_images: threadData.thread_images.filter(
                img => img.id !== imageId,
            ),
            deletedImageIds: [...threadData.deletedImageIds, imageId],
        })
    }

    // 更新処理
    const handleUpdateSubmit = async e => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData()
        formData.append('title', threadData.title)
        formData.append('content', threadData.content)
        threadData.thread_images.forEach(img => {
            formData.append('threadImages', img.id)
        })
        threadData.deletedImageIds.forEach(id => {
            formData.append('deletedImageIds', id)
        })
        threadData.newImages.forEach(img => {
            formData.append('newImages', img)
        })
        try {
            const response = await axios.patch(`/api/threads/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // 削除処理
    const handleDeleteSubmit = async e => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.delete(`/api/threads/${id}`)
            console.log(response)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Layout>
            <Header>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <form>
                            <div>
                                <label htmlFor="text">キャプション</label>
                                <textarea
                                    id="text"
                                    value={threadData.text}
                                    onChange={handleTextChange}
                                />
                            </div>

                            <input
                                id="threadImages"
                                type="file"
                                hidden
                                multiple
                                accept=".jpg, .jpeg, .png"
                                onChange={handleThreadImageChange}
                            />
                            <div className={styles.threadImagesContainer}>
                                <div className={styles.imageContainer}>
                                    {/* 元々あったデータを表示 */}
                                    {threadData.thread_images.map(
                                        (image, index) => (
                                            <ExhibitImage
                                                key={index}
                                                index={index}
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.path}`}
                                                onDelete={e =>
                                                    handleDeleteImage(
                                                        e,
                                                        image.id,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                    {/* 新しく追加したデータを表示 */}
                                    {threadData.newImages.map(
                                        (image, index) => (
                                            <ExhibitImage
                                                key={index}
                                                index={
                                                    index +
                                                    threadData.thread_images
                                                        .length
                                                }
                                                src={URL.createObjectURL(image)}
                                                onDelete={e =>
                                                    handleDeleteNewImage(
                                                        e,
                                                        index,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                    {/* デフォルト画像を表示 */}
                                    {[
                                        ...Array(
                                            6 -
                                                threadData.thread_images
                                                    .length -
                                                threadData.newImages.length,
                                        ),
                                    ].map((_, index) => (
                                        <label
                                            htmlFor="threadImages"
                                            key={index}>
                                            <ExhibitDefaultImage
                                                index={
                                                    index +
                                                    threadData.thread_images
                                                        .length +
                                                    threadData.newImages.length
                                                }
                                                src={'/default.jpg'}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleUpdateSubmit}
                                disabled={isSubmitting}>
                                更新
                            </button>

                            <button
                                onClick={handleDeleteSubmit}
                                disabled={isSubmitting}>
                                削除
                            </button>
                        </form>
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const { req, res } = context
    const { id } = context.params // 動的なidを取得
    try {
        const response = await axios.get(`/api/threads/${id}`, {
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

export default thread
