import React from 'react'
import styles from '@/styles/edit.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Textarea from '@/components/Textarea'
import ExhibitImage from '@/components/ExhibitImage'
import ExhibitDefaultImage from '@/components/ExhibitDefaultImage'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

const threadEdit = ({ id, data }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [threadData, setThreadData] = useState({
        text: data.text || '',
        thread_images: data.thread_images || [],
        deletedImageIds: [],
        newImages: [],
        archive: data.archive,
    })
    console.log(threadData)

    // textを更新する関数
    const handleTextChange = e => {
        setThreadData({
            ...threadData,
            text: e.target.value,
        })
    }
    // archiveを更新する関数
    const handleArchiveChange = e => {
        setThreadData({
            ...threadData,
            archive: Number(e.target.value),
        })
    }

    // 新しく追加する画像を更新する関数
    const handleThreadImageChange = e => {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => file)
        if (threadData.thread_images.length + newImages.length > 6) {
            alert('画像は6枚までしかアップロードできません。')
            return
        }
        setThreadData(prevThreadData => {
            return {
                ...prevThreadData,
                newImages: [...prevThreadData.newImages, ...newImages],
            }
        })
    }
    // 新しく追加する画像を削除する関数
    const handleDeleteNewImage = (e, index) => {
        e.preventDefault()
        const updatedImages = [...threadData.newImages]
        updatedImages.splice(index, 1)
        setThreadData({
            ...threadData,
            newImages: updatedImages,
        })
    }

    // 保存されている画像を削除する関数
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
        if (
            threadData.thread_images.length === 0 &&
            threadData.newImages.length === 0
        ) {
            alert('画像を１枚以上選んでください')
            setIsSubmitting(false)
            return
        }
        const formData = new FormData()
        formData.append('text', threadData.text)
        formData.append('archive', threadData.archive)
        threadData.deletedImageIds.forEach(id => {
            formData.append('deletedImageIds[]', id)
        })
        threadData.newImages.forEach(img => {
            formData.append('newImages[]', img)
        })
        try {
            const response = await axios.post(`/api/threads/${id}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PATCH',
                },
            })
            console.log(response)
            router.push(`/thread/${id}`)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // 削除処理
    const handleDeleteSubmit = async e => {
        e.preventDefault()
        const shouldDelete = window.confirm('本当に削除してもよろしいですか？')
        if (!shouldDelete) {
            return
        }
        setIsSubmitting(true)
        try {
            const response = await axios.delete(`/api/threads/${id}`)
            console.log(response)
            router.push('/profile')
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
                                    {Array.from({
                                        length:
                                            6 -
                                            threadData.thread_images.length -
                                            threadData.newImages.length,
                                    }).map((_, index) => (
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

                            <div className={styles.textareaBox}>
                                <p>キャプションを編集</p>
                                <Textarea
                                    onChange={handleTextChange}
                                    value={threadData.text}
                                    placeholder="キャプションを入力"
                                />
                            </div>

                            <div className={styles.selectBox}>
                                <label htmlFor="archive">Archive</label>
                                <select
                                    name="archive"
                                    id="archive"
                                    required
                                    value={threadData.archive}
                                    className={styles.select}
                                    onChange={handleArchiveChange}>
                                    <option value="1">Not Archive</option>
                                    <option value="0">Archive</option>
                                </select>
                            </div>

                            <div className="flex">
                                <div className={styles.submitButtonBox}>
                                    <button
                                        className={styles.updateButton}
                                        onClick={handleUpdateSubmit}
                                        disabled={isSubmitting}>
                                        投稿を更新
                                    </button>
                                </div>

                                <div className={styles.submitButtonBox}>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={handleDeleteSubmit}
                                        disabled={isSubmitting}>
                                        投稿を削除
                                    </button>
                                </div>
                            </div>
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

export default threadEdit
