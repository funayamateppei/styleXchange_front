import React, { useEffect } from 'react'
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

const itemEdit = ({ id, data, secondCategoriesList, thirdCategoriesList }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [threadData, setThreadData] = useState({
        title: data.title || '',
        text: data.text || '',
        price: data.price,
        gender: data.gender,
        category_id: data.category_id,
        color: data.color,
        size: data.size,
        condition: data.condition,
        days: data.days,
        sale: data.sale,
        postage: data.postage,
        url: data.url,
        item_images: data.item_images || [],
        deletedImageIds: [],
        newImages: [],
    })
    console.log(threadData)

    // 新しく追加する画像を更新する関数
    const handleThreadImageChange = e => {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => file)
        if (threadData.item_images.length + newImages.length > 6) {
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
            item_images: threadData.item_images.filter(
                img => img.id !== imageId,
            ),
            deletedImageIds: [...threadData.deletedImageIds, imageId],
        })
    }

    // 更新する関数
    const handleChange = e => {
        setThreadData({
            ...threadData,
            [e.target.name]: e.target.value,
        })
    }
    const handleNumberChange = e => {
        setThreadData({
            ...threadData,
            [e.target.name]: Number(e.target.value),
        })
    }

    // カテゴリーの何層目を開いているかのstate
    const [isOpenFirstCategory, setIsOpenFirstCategory] = useState(false)
    const [isOpenSecondCategory, setIsOpenSecondCategory] = useState(false)
    const [isOpenThirdCategory, setIsOpenThirdCategory] = useState(false)
    // カテゴリーの配列のstate
    const [firstCategories, setFirstCategories] = useState([
        { gender: 1, name: 'MENS' },
        { gender: 0, name: 'LADIES' },
    ])
    const [secondCategories, setSecondCategories] = useState([])
    const [thirdCategories, setThirdCategories] = useState([])
    // 最初のセレクト画面
    const firstCategoryIsOpen = e => {
        e.preventDefault()
        setIsOpenFirstCategory(true)
    }
    const firstCategoryIsClose = e => {
        e.preventDefault()
        setIsOpenFirstCategory(false)
    }
    // １個目を選んだ時の関数
    const secondCategoryIsOpen = e => {
        e.preventDefault()
        setIsOpenSecondCategory(true) // ２個目の選択画面を開く
        setThreadData({ ...threadData, gender: Number(e.target.value) })
        const filteredSecondCategories = secondCategoriesList.filter(
            category =>
                category.gender == 2 || category.gender == e.target.value,
        ) // データ更新
        setSecondCategories(filteredSecondCategories) // ２個目の選択肢の配列を更新
    }
    const secondCategoryIsClose = e => {
        e.preventDefault()
        setIsOpenSecondCategory(false) // ２個目の選択画面を閉じる
        setThreadData({
            ...threadData,
            gender: data.gender,
            category_id: threadData.category_id,
        }) // データを元に戻す
        setSecondCategories([]) // ２個目の選択肢の配列を初期化
    }
    // ２個目を選んだ時の関数
    const thirdCategoryIsOpen = e => {
        e.preventDefault()
        setIsOpenThirdCategory(true) // ３個目の選択画面を表示
        const filteredThirdCategories = thirdCategoriesList.filter(
            category =>
                category.parent == e.target.value &&
                (threadData.gender == 1
                    ? category.gender == 2 || category.gender == 1
                    : category.gender == 2 || category.gender == 0),
        )
        setThirdCategories(filteredThirdCategories) // ３個目の選択肢の配列を更新
    }
    const thirdCategoryIsClose = e => {
        e.preventDefault()
        setIsOpenThirdCategory(false) // ３個目の選択画面を閉じる
        setThirdCategories([]) // ３個目の選択肢の配列を初期化
    }
    // ３個目を選んだ時の関数
    const thirdCategorySelect = e => {
        e.preventDefault()
        setIsOpenFirstCategory(false) // １個目の選択画面を閉じる
        setIsOpenSecondCategory(false) // ２個目の選択画面を閉じる
        setIsOpenThirdCategory(false) // ３個目の選択画面を閉じる
        setThreadData({ ...threadData, category_id: Number(e.target.value) }) // データを更新
    }

    // 色選択 関数
    const [colorModalOpen, setColorModalOpen] = useState(false)
    const colors = [
        'white',
        'black',
        'gray',
        'brown',
        'beige',
        'green',
        'blue',
        'purple',
        'yellow',
        'pink',
        'red',
        'orange',
    ]
    const handleColorChange = color => {
        setThreadData({ ...threadData, color: color })
        setColorModalOpen(false)
    }
    const handleColorModalButtonClick = e => {
        e.preventDefault()
        setColorModalOpen(true)
    }
    const colorClear = e => {
        e.preventDefault()
        setThreadData({ ...threadData, color: '' })
    }

    const sizeArray = [
        'XXS以下',
        'XS',
        'S',
        'M',
        'L',
        'XL',
        '2XL',
        '3XL',
        '4XL以上',
        'FREE',
    ]

    const conditionArray = [
        '新品未使用',
        '未使用に近い',
        '目立った傷や汚れなし',
        'やや傷や汚れあり',
        '傷や汚れあり',
        '全体的に状態が悪い',
    ]

    const daysArray = ['1~2日で発送', '2~3日で発送', '4~7日で発送']

    // 更新処理
    const handleUpdateSubmit = async e => {
        e.preventDefault()
        setIsSubmitting(true)
        if (
            threadData.item_images.length === 0 &&
            threadData.newImages.length === 0
        ) {
            alert('画像を１枚以上選んでください')
            setIsSubmitting(false)
            return
        }
        const formData = new FormData()
        formData.append('item[title]', threadData.title)
        formData.append('item[text]', threadData.text)
        formData.append('item[price]', threadData.price)
        formData.append('item[gender]', threadData.gender)
        formData.append('item[category_id]', threadData.category_id)
        formData.append('item[color]', threadData.color)
        formData.append('item[size]', threadData.size)
        formData.append('item[condition]', threadData.condition)
        formData.append('item[days]', threadData.days)
        formData.append('item[sale]', threadData.sale)
        formData.append('item[postage]', threadData.postage)
        formData.append('item[url]', threadData.url)
        threadData.deletedImageIds.forEach(id => {
            formData.append('deletedImageIds[]', id)
        })
        threadData.newImages.forEach(img => {
            formData.append('newImages[]', img)
        })
        try {
            const response = await axios.post(`/api/items/${id}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PATCH',
                },
            })
            console.log(response)
            router.push(`/item/${id}`)
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
            const response = await axios.delete(`/api/items/${id}`)
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
                                    {threadData.item_images.map(
                                        (image, index) => (
                                            <ExhibitImage
                                                key={index}
                                                index={index}
                                                src={`${process.env.NEXT_PUBLIC_AWS_URL}${image.path}`}
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
                                                    threadData.item_images
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
                                            threadData.item_images.length -
                                            threadData.newImages.length,
                                    }).map((_, index) => (
                                        <label
                                            htmlFor="threadImages"
                                            key={index}>
                                            <ExhibitDefaultImage
                                                index={
                                                    index +
                                                    threadData.item_images
                                                        .length +
                                                    threadData.newImages.length
                                                }
                                                src={'/default.jpg'}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.labelInputBox}>
                                <label htmlFor="title">商品名</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className={styles.input}
                                    placeholder="必須（50文字まで）"
                                    required
                                    value={threadData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.textareaBox}>
                                <p>商品詳細</p>
                                <Textarea
                                    name="text"
                                    onChange={handleChange}
                                    value={threadData.text}
                                    placeholder="キャプションを入力"
                                />
                            </div>

                            <div className={styles.priceAndErrorBox}>
                                <div className={styles.priceBox}>
                                    <label htmlFor="price">販売価格</label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        className={styles.price}
                                        value={threadData.price}
                                        placeholder="必須 ¥300 ~"
                                        required
                                        onChange={handleNumberChange}
                                    />
                                </div>
                                {threadData.price < 300 &&
                                threadData.price !== '' ? (
                                    <p className={styles.priceError}>
                                        価格は¥300以上にしてください
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <div className={styles.colorSelect}>
                                    <div className={styles.categoryBox}>
                                        <button
                                            className={
                                                styles.categoryModalButton
                                            }
                                            onClick={firstCategoryIsOpen}>
                                            カテゴリ選択
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 ml-2">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                />
                                            </svg>
                                        </button>
                                        {threadData.gender !== '' &&
                                        threadData.category_id !== '' ? (
                                            <>
                                                <p>
                                                    {threadData.gender
                                                        ? 'メンズ'
                                                        : 'レディース'}
                                                    /
                                                </p>
                                                <p>
                                                    {thirdCategoriesList &&
                                                    threadData.category_id
                                                        ? secondCategoriesList
                                                              .filter(
                                                                  category =>
                                                                      category.parent ===
                                                                      thirdCategoriesList.find(
                                                                          category =>
                                                                              category.id ===
                                                                              threadData.category_id,
                                                                      ).parent,
                                                              )
                                                              .map(
                                                                  category =>
                                                                      category.name,
                                                              )
                                                        : null}
                                                    /
                                                </p>
                                                <p>
                                                    {thirdCategoriesList &&
                                                    threadData.category_id
                                                        ? thirdCategoriesList
                                                              .filter(
                                                                  category =>
                                                                      category.id ===
                                                                      threadData.category_id,
                                                              )
                                                              .map(
                                                                  category =>
                                                                      category.name,
                                                              )
                                                        : null}
                                                </p>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                {/* １個目の選択画面 */}
                                <div
                                    className={
                                        isOpenFirstCategory
                                            ? `${styles.firstCategoryList} ${styles.slideShow}`
                                            : `${styles.firstCategoryList} ${styles.slideHidden}`
                                    }>
                                    <div className={styles.categoryHeader}>
                                        <div
                                            className="flex justify-center cursor-pointer h-16 items-center ml-4 w-12"
                                            onClick={firstCategoryIsClose}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                                                />
                                            </svg>
                                        </div>
                                        <div className={styles.categoryList}>
                                            {firstCategories
                                                ? firstCategories.map(
                                                      (category, index) => (
                                                          <div
                                                              className={
                                                                  styles.categoryButton
                                                              }
                                                              key={index}>
                                                              <button
                                                                  value={
                                                                      category.gender
                                                                  }
                                                                  onClick={
                                                                      secondCategoryIsOpen
                                                                  }>
                                                                  {
                                                                      category.name
                                                                  }
                                                              </button>
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  strokeWidth={
                                                                      1.5
                                                                  }
                                                                  stroke="currentColor"
                                                                  className="w-6 h-6">
                                                                  <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                                  />
                                                              </svg>
                                                          </div>
                                                      ),
                                                  )
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                {/* ２個目の選択画面 */}
                                <div
                                    className={
                                        isOpenSecondCategory
                                            ? `${styles.secondCategoryList} ${styles.slideShow}`
                                            : `${styles.secondCategoryList} ${styles.slideHidden}`
                                    }>
                                    <div className={styles.categoryHeader}>
                                        <div
                                            className="flex justify-center cursor-pointer h-16 items-center ml-4 w-12"
                                            onClick={secondCategoryIsClose}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                                                />
                                            </svg>
                                        </div>
                                        <div className={styles.categoryList}>
                                            {secondCategories
                                                ? secondCategories.map(
                                                      (category, index) => (
                                                          <div
                                                              className={
                                                                  styles.categoryButton
                                                              }
                                                              key={index}>
                                                              <button
                                                                  value={
                                                                      category.parent
                                                                  }
                                                                  onClick={
                                                                      thirdCategoryIsOpen
                                                                  }>
                                                                  {
                                                                      category.name
                                                                  }
                                                              </button>
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  strokeWidth={
                                                                      1.5
                                                                  }
                                                                  stroke="currentColor"
                                                                  className="w-6 h-6">
                                                                  <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                                  />
                                                              </svg>
                                                          </div>
                                                      ),
                                                  )
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                {/* ３個目の選択画面 */}
                                <div
                                    className={
                                        isOpenThirdCategory
                                            ? `${styles.thirdCategoryList} ${styles.slideShow}`
                                            : `${styles.thirdCategoryList} ${styles.slideHidden}`
                                    }>
                                    <div className={styles.categoryHeader}>
                                        <div
                                            className="flex justify-center cursor-pointer h-16 items-center ml-4 w-12"
                                            onClick={thirdCategoryIsClose}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                                                />
                                            </svg>
                                        </div>
                                        <div className={styles.categoryList}>
                                            {thirdCategories
                                                ? thirdCategories.map(
                                                      (category, index) => (
                                                          <div
                                                              className={
                                                                  styles.categoryButton
                                                              }
                                                              key={index}>
                                                              <button
                                                                  value={
                                                                      category.id
                                                                  }
                                                                  onClick={
                                                                      thirdCategorySelect
                                                                  }>
                                                                  {
                                                                      category.name
                                                                  }
                                                              </button>
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  strokeWidth={
                                                                      1.5
                                                                  }
                                                                  stroke="currentColor"
                                                                  className="w-6 h-6">
                                                                  <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                                  />
                                                              </svg>
                                                          </div>
                                                      ),
                                                  )
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.colorSelect}>
                                <label htmlFor="color">カラー選択</label>
                                <button
                                    id="color"
                                    className={styles.modalButton}
                                    onClick={handleColorModalButtonClick}>
                                    {threadData.color === ''
                                        ? '未選択'
                                        : `${threadData.color}`}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 ml-2">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className={styles.colorClearButton}
                                    onClick={colorClear}>
                                    clear
                                </button>
                                {/* カラー選択モーダル */}
                                {colorModalOpen && (
                                    <div>
                                        <div
                                            className={styles.modalBackground}
                                            onClick={() =>
                                                setColorModalOpen(false)
                                            }></div>
                                        <div className={styles.modal}>
                                            {colors.map((color, index) => (
                                                <img
                                                    key={index}
                                                    value={color}
                                                    src={`/color/color_${color}.png`}
                                                    onClick={() =>
                                                        handleColorChange(color)
                                                    }
                                                    className={
                                                        styles.modalColorImage
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.selectBox}>
                                <label htmlFor="size">サイズ</label>
                                <select
                                    name="size"
                                    id="size"
                                    required
                                    value={threadData.size}
                                    className={styles.select}
                                    onChange={handleChange}>
                                    {sizeArray.map((size, index) => (
                                        <option key={index} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.selectBox}>
                                <label htmlFor="condition">商品の状態</label>
                                <select
                                    name="condition"
                                    id="condition"
                                    required
                                    value={threadData.condition}
                                    className={styles.select}
                                    onChange={handleChange}>
                                    {conditionArray.map((condition, index) => (
                                        <option key={index} value={condition}>
                                            {condition}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.selectBox}>
                                <label htmlFor="days">発送までの日数</label>
                                <select
                                    name="days"
                                    id="days"
                                    required
                                    value={threadData.days}
                                    className={styles.select}
                                    onChange={handleChange}>
                                    {daysArray.map((days, index) => (
                                        <option key={index} value={days}>
                                            {days}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.selectBox}>
                                <label htmlFor="sale">販売状況</label>
                                <select
                                    name="sale"
                                    id="sale"
                                    required
                                    value={threadData.archive}
                                    className={styles.select}
                                    onChange={handleNumberChange}>
                                    <option value="1">FOR SALE</option>
                                    <option value="0">SOLD OUT</option>
                                </select>
                            </div>

                            <div className={styles.selectBox}>
                                <label htmlFor="postage">配送料の負担</label>
                                <select
                                    name="postage"
                                    id="postage"
                                    required
                                    value={threadData.postage}
                                    className={styles.select}
                                    onChange={handleNumberChange}>
                                    <option value="1">送料込み</option>
                                    <option value="0">着払い</option>
                                </select>
                            </div>

                            <div className={styles.priceBox}>
                                <label htmlFor="url">商品URL</label>
                                <input
                                    id="url"
                                    type="text"
                                    name="url"
                                    className={styles.price}
                                    value={threadData.url}
                                    required
                                    onChange={handleChange}
                                />
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
        const response = await axios.get(`/api/items/${id}`, {
            withCredentials: true,
            headers: {
                Cookie: `graduation_back_session=${req.headers.cookie.graduation_back_session}; XSRF-TOKEN=${req.headers.cookie['XSRF-TOKEN']}`,
            },
        })

        const res = await axios.get('/api/categories')
        const categories = await res.data
        const secondCategoriesList = await categories.filter(
            category => category.big_category == 1,
        )
        const thirdCategoriesList = await categories.filter(
            category => category.big_category == 0,
        )

        return {
            props: {
                data: response.data,
                id: id,
                secondCategoriesList,
                thirdCategoriesList,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default itemEdit
