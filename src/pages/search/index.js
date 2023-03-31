import React from 'react'
import styles from '@/styles/search.module.css'

import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import FooterTabBar from '@/components/FooterTabBar'

import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { useRouter } from 'next/router'

const Search = ({ secondCategoriesList, thirdCategoriesList }) => {
    const { user } = useAuth({ middleware: 'guest' })
    const router = useRouter()

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
    // カテゴリ選択のstate
    const [firstSelect, setFirstSelect] = useState('')
    const [secondSelect, setSecondSelect] = useState('')

    // フリーワードのstate
    const [word, setWord] = useState('')

    const firstCategoryIsOpen = () => {
        setIsOpenFirstCategory(true)
    }
    const firstCategoryIsClose = () => {
        setIsOpenFirstCategory(false)
    }

    const secondCategoryIsOpen = e => {
        setIsOpenSecondCategory(true)
        setFirstSelect(e.target.value)
        const filteredSecondCategories = secondCategoriesList.filter(
            category =>
                category.gender == 2 || category.gender == e.target.value,
        )
        setSecondCategories(filteredSecondCategories)
    }
    const secondCategoryIsClose = () => {
        setIsOpenSecondCategory(false)
        setFirstSelect('')
        setSecondCategories([])
    }

    const thirdCategoryIsOpen = e => {
        setIsOpenThirdCategory(true)
        setSecondSelect(e.target.value)
        const filteredThirdCategories = thirdCategoriesList.filter(
            category =>
                category.parent == e.target.value &&
                (firstSelect == 1
                    ? category.gender == 2 || category.gender == 1
                    : category.gender == 2 || category.gender == 0),
        )
        setThirdCategories(filteredThirdCategories)
    }
    const thirdCategoryIsClose = () => {
        setIsOpenThirdCategory(false)
        setThirdCategories([])
        setSecondSelect('')
    }

    const categorySearch = e => {
        const searchUrl = `/search/result/thread/category?gender=${firstSelect}&category=${e.target.value}`
        router.push(searchUrl)
    }

    function handleSubmit(event) {
        event.preventDefault()
        const searchUrl = `/search/result/thread/word?word=${word}`
        router.push(searchUrl)
    }

    return (
        <Layout>
            <Head>
                <title>Exhibit</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.search}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="gray"
                            className="w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={e => setWord(e.target.value)}
                                className={styles.searchInput}
                            />
                        </form>
                    </div>

                    <div className={styles.category}>
                        <button onClick={firstCategoryIsOpen}>
                            カテゴリーから探す
                        </button>
                    </div>

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
                                    ? firstCategories.map((category, index) => (
                                          <div
                                              className={styles.categoryButton}
                                              key={index}>
                                              <button
                                                  value={category.gender}
                                                  onClick={
                                                      secondCategoryIsOpen
                                                  }>
                                                  {category.name}
                                              </button>
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
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                  />
                                              </svg>
                                          </div>
                                      ))
                                    : null}
                            </div>
                        </div>
                    </div>

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
                                                      value={category.parent}
                                                      onClick={
                                                          thirdCategoryIsOpen
                                                      }>
                                                      {category.name}
                                                  </button>
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
                                    ? thirdCategories.map((category, index) => (
                                          <div
                                              className={styles.categoryButton}
                                              key={index}>
                                              <button
                                                  value={category.id}
                                                  onClick={categorySearch}>
                                                  {category.name}
                                              </button>
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
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                  />
                                              </svg>
                                          </div>
                                      ))
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
                <FooterTabBar user={user} />
            </div>
        </Layout>
    )
}

// カテゴリを全て取得
export async function getStaticProps() {
    const response = await axios.get('/api/categories')
    const categories = await response.data
    const secondCategoriesList = await categories.filter(
        category => category.big_category == 1,
    )
    const thirdCategoriesList = await categories.filter(
        category => category.big_category == 0,
    )
    return {
        props: {
            secondCategoriesList,
            thirdCategoriesList,
        },
        revalidate: 3,
    }
}

export default Search
