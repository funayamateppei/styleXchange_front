import React from 'react'
import styles from '@/styles/item.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Link from 'next/link'
import Image from '@/components/Image'
import Slider from '@/components/Slider'
import ThreadItem from '@/components/ThreadItem'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

const Item = ({ id, itemData }) => {
    const { user } = useAuth({ middleware: 'auth' })

    // CSRで最新の情報を取得
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/items/${id}`
    const { data: data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: itemData,
    })
    useEffect(() => {
        mutate()
    }, [])

    if (data) {
        const price = data.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    console.log(data)

    // コメントInput更新処理
    const [comment, setComment] = useState('')
    const [message, setMessage] = useState('')
    const handleInputChange = e => {
        setComment(e.target.value)
        console.log(comment)
    }

    // いいね機能
    const likeSubmit = async () => {
        // API通信
        try {
            const response = await axios.post(`/api/items/likes/${id}`)
            if (response.status === 204) {
                console.log('success')
                mutate()
            }
        } catch (error) {
            if (error.response) {
                // サーバからエラーレスポンスが返された場合の処理
                console.log('failed')
            }
        }
    }

    // 関連する投稿の情報を取得し、表示している投稿を削除する
    let relativeItems = []
    if (data) {
        if (data.user.items) {
            data.user.items.filter(function (item) {
                if (item.id !== data.id) {
                    relativeItems.push(item)
                }
            })
        }
    }

    if (itemData === null) {
        return (
            <div className={styles.flexContainer}>
                <img src="loading.gif" alt="loading" />
            </div>
        )
    }

    return (
        <>
            <Layout>
                <Header>
                    <Head>
                        <title>Thread</title>
                    </Head>
                    <div className={styles.container}>
                        {/* ページコンテンツ */}
                        <div className={styles.content}>
                            <div className={styles.userInfo}>
                                {data ? (
                                    <Link
                                        href={
                                            data && `/profile/${data.user.id}`
                                        }>
                                        <div className={styles.iconAndName}>
                                            {data?.user?.icon_path ? (
                                                <Image
                                                    src={data.user.icon_path}
                                                    alt="icon"
                                                    style="h-12 w-12 rounded-full border border-gray-400"
                                                />
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-10 h-10 rounded-full border border-gray-800">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                    />
                                                </svg>
                                            )}
                                            <h2>
                                                {data ? data.user.name : null}
                                            </h2>
                                            <p>
                                                {data ? data.user.height : null}
                                                cm
                                            </p>
                                        </div>
                                    </Link>
                                ) : null}
                                <div>
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
                                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.sliderBox}>
                                {(data && (
                                    <Slider images={data.item_images} />
                                )) ||
                                    null}
                                <div className={styles.statusBox}>
                                    <div
                                        className={`${styles.statusButton} ml-2`}>
                                        {data && user ? (
                                            data.liked_items ? (
                                                data.liked_items.some(
                                                    like => like.id === user.id,
                                                ) ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="rgb(255, 100, 100)"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                        onClick={likeSubmit}>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                        onClick={likeSubmit}>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                                        />
                                                    </svg>
                                                )
                                            ) : null
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={styles.statusCountBox}>
                                    <div
                                        className={`${styles.statusCount} ml-5`}>
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
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                            />
                                        </svg>
                                        <p>
                                            {data
                                                ? data.liked_items
                                                    ? data.liked_items.length
                                                    : 0
                                                : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2>{data ? data.title : null}</h2>
                                <p>
                                    値段 : ¥
                                    {data
                                        ? data.price
                                              .toString()
                                              .replace(
                                                  /\B(?=(\d{3})+(?!\d))/g,
                                                  ',',
                                              )
                                        : null}
                                </p>
                                <p>{data ? data.text : null}</p>
                            </div>

                            <div className={styles.textContainer}>
                                <div className={styles.commentsTitle}>
                                    コメント一覧
                                </div>
                                <div className={styles.commentContainer}>
                                    {data
                                        ? data.item_comments
                                              .slice(0, 2)
                                              .map((commentData, index) => (
                                                  <div key={index}>
                                                      <div
                                                          className={
                                                              styles.commentBox
                                                          }>
                                                          {commentData?.user
                                                              ?.icon_path ? (
                                                              <Image
                                                                  src={
                                                                      commentData
                                                                          .user
                                                                          .icon_path
                                                                  }
                                                                  alt="icon"
                                                                  style="h-12 w-12 rounded-full border border-gray-400"
                                                              />
                                                          ) : (
                                                              <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  strokeWidth={
                                                                      1.5
                                                                  }
                                                                  stroke="currentColor"
                                                                  className="w-10 h-10 rounded-full border border-gray-800">
                                                                  <path
                                                                      strokeLinecap="round"
                                                                      strokeLinejoin="round"
                                                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                                                  />
                                                              </svg>
                                                          )}
                                                          <p
                                                              className={
                                                                  styles.name
                                                              }>
                                                              {commentData?.user
                                                                  ?.name
                                                                  ? commentData
                                                                        .user
                                                                        .name
                                                                  : null}
                                                          </p>
                                                      </div>
                                                      <p
                                                          className={
                                                              styles.comment
                                                          }>
                                                          {commentData
                                                              ? commentData.comment
                                                              : null}
                                                      </p>
                                                  </div>
                                              ))
                                        : null}
                                    {data ? (
                                        data.item_comments ? (
                                            data.item_comments.length >= 3 ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6 m-2 text-gray-500">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                                    />
                                                </svg>
                                            ) : null
                                        ) : null
                                    ) : null}
                                    {data ? (
                                        data.item_comments ? (
                                            data.item_comments.length >= 3 ? (
                                                <Link
                                                    href={`/item/comment/${data.id}`}>
                                                    <button
                                                        className={
                                                            styles.commentMoreButton
                                                        }>
                                                        MORE
                                                    </button>
                                                </Link>
                                            ) : null
                                        ) : null
                                    ) : null}
                                </div>
                                <div className={styles.commentInput}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        className={styles.submitButton}
                                        disabled={comment ? true : false}
                                        // onClick={submit}
                                    >
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
                                                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-red-500">{message}</p>
                            </div>

                            <div className={styles.detailBox}>
                                <div className={styles.detail}>
                                    <p className={styles.detailCategory}>
                                        カテゴリー
                                    </p>
                                    <p
                                        className={`${styles.preLine} ${styles.detailData}`}>
                                        {data
                                            ? data.category
                                                ? data.parent_category
                                                    ? data.gender === 0
                                                        ? `メンズ/${data.parent_category.name}/\n${data.category.name}`
                                                        : `レディース/${data.parent_category.name}/\n${data.category.name}`
                                                    : null
                                                : null
                                            : null}
                                    </p>
                                </div>

                                <div className={styles.detail}>
                                    <p className={styles.detailName}>サイズ</p>
                                    <p className={styles.detailData}>
                                        {data ? data.size : null}
                                    </p>
                                </div>

                                <div className={styles.detail}>
                                    <p className={styles.detailName}>
                                        商品の状態
                                    </p>
                                    <p className={styles.detailData}>
                                        {data ? data.condition : null}
                                    </p>
                                </div>

                                <div className={styles.detail}>
                                    <p className={styles.detailName}>
                                        配送料の負担
                                    </p>
                                    <p className={styles.detailData}>
                                        {data
                                            ? data.postage
                                                ? '送料込み'
                                                : '着払い'
                                            : null}
                                    </p>
                                </div>

                                <div className={styles.detail}>
                                    <p className={styles.detailName}>
                                        発送までの日数
                                    </p>
                                    <p className={styles.detailData}>
                                        {data ? data.days : null}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.exhibitButton}>
                                <button>
                                    <a
                                        href="https://jp.mercari.com/item/m33022208115?utm_source=ios&utm_medium=share&source_location=share"
                                        rel="noreferrer noopener"
                                        target="_blank">
                                        購入
                                    </a>
                                </button>
                            </div>

                            <div className={styles.itemsContainer}>
                                <h2>他の販売中のアイテム</h2>
                                <div className={styles.itemsBox}>
                                    {data
                                        ? data &&
                                          data.user.items
                                              .slice(0, 3)
                                              .map((item, index) => (
                                                  <ThreadItem
                                                      key={index}
                                                      item={item}
                                                  />
                                              ))
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <FooterTabBar user={user} />
                </Header>
            </Layout>
        </>
    )
}

export async function getAllItemIds() {
    const response = await axios.get('/api/items/ids')
    const items = await response.data
    return await items.map(item => {
        return {
            params: {
                id: String(item.id),
            },
        }
    })
}

export async function getStaticPaths() {
    const paths = await getAllItemIds()
    return {
        paths,
        fallback: true,
    }
}

export async function getItemData(id) {
    const response = await axios.get(`/api/items/${id}`)
    const data = await response.data
    return data
}

export async function getStaticProps({ params }) {
    const data = await getItemData(params.id)
    const id = data.id
    return {
        props: {
            id: id,
            itemData: data,
        },
        revalidate: 3,
    }
}

export default Item
