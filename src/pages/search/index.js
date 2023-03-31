import React from 'react'
import styles from '@/styles/search.module.css'

import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import Header from '@/components/Header'
import FooterTabBar from '@/components/FooterTabBar'

import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Search = ({ secondCategoriesList, thirdCategoriesList }) => {
    const { user } = useAuth({ middleware: 'guest' })

    // カテゴリーの何層目を開いているかのstate
    const [isOpenFirstCategory, setIsOpenFirstCategory] = useState(false)
    const [isOpenSecondCategory, setIsOpenSecondCategory] = useState(false)
    const [isOpenThirdCategory, setIsOpenThirdCategory] = useState(false)
    // カテゴリーの配列のstate
    const [firstCategories, setFirstCategories] = useState(['MENS', 'LADIES'])
    const [secondCategories, setSecondCategories] = useState([])
    const [thirdCategories, setThirdCategories] = useState([])

    const firstCategoryIsOpen = () => {
        setIsOpenFirstCategory(true)
    }
    const firstCategoryIsClose = () => {
        setIsOpenFirstCategory(false)
    }

    const secondCategoryIsOpen = () => {
        setIsOpenSecondCategory(true)
    }
    const secondCategoryIsClose = () => {
        setIsOpenSecondCategory(false)
    }

    const thirdCategoryIsOpen = () => {
        setIsOpenThirdCategory(true)
    }
    const thirdCategoryIsClose = () => {
        setIsOpenThirdCategory(false)
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
                        <form>
                            <input
                                type="text"
                                placeholder="Search"
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
                                                  onClick={
                                                      secondCategoryIsOpen
                                                  }>
                                                  {category}
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
                                                      onClick={
                                                          thirdCategoryIsOpen
                                                      }>
                                                      {category}
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
                                                  onClick={thirdCategoryIsOpen}>
                                                  {category}
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
