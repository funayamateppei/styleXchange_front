import React from 'react'
import styles from '@/styles/components/ItemExhibit.module.css'
import { useState } from 'react'

import Textarea from '@/components/Textarea'
import ExhibitImage from '@/components/ExhibitImage'
import ExhibitDefaultImage from '@/components/ExhibitDefaultImage'

const ExhibitItem = ({
    index,
    form,
    secondCategories,
    thirdCategories,
    onChange,
    onDelete,
}) => {
    const {
        title,
        text,
        price,
        gender,
        category_id,
        color,
        size,
        condition,
        days,
        postage,
        url,
        images,
    } = form

    // ItemImages更新関数
    const handleItemImageChange = e => {
        const files = Array.from(e.target.files)
        if (files.length <= 6) {
            onChange({ ...form, images: [...images, ...files] })
        } else {
            alert('画像は6枚までしか選択できません')
        }
    }

    // ItemImages削除関数
    const handleDeleteItemImage = (e, i) => {
        const newItemImages = [...images] // 画像配列のコピーを作成
        newItemImages.splice(i, 1) // 指定されたインデックスの画像を削除
        onChange({ ...form, images: newItemImages }) // 画像配列を更新
    }

    // 更新関数
    const handleChange = e => {
        onChange({ ...form, [e.target.name]: e.target.value })
    }

    // カテゴリ選択 関数
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [stateFirstCategories, setFirstCategories] = useState(true)
    const [stateSecondCategories, setStateSecondCategories] = useState(true)
    const [secondCategoriesName, setSecondCategoriesName] = useState('')
    const [thirdCategoriesName, setThirdCategoriesName] = useState('')
    const [SecondCategories, setSecondCategories] = useState([])
    const [ThirdCategories, setThirdCategories] = useState([])
    // モーダルオープン
    const handleCategoryModalButtonClick = e => {
        e.preventDefault()
        setCategoryModalOpen(true)
        setFirstCategories(true)
        setStateSecondCategories(true)
        setSecondCategoriesName('')
        setThirdCategoriesName('')
        setSecondCategories([])
        setThirdCategories([])
        onChange({ ...form, gender: '' })
        onChange({ ...form, category_id: '' })
    }
    // firstCategory選択時にgenderカラムのstate更新 secondCategory表示
    const handleFirstCategoryChange = e => {
        e.preventDefault()
        setFirstCategories(false)
        onChange({ ...form, gender: e.target.value == 1 ? true : false })
        const filteredSecondCategories = secondCategories.filter(
            category =>
                category.gender == 2 || category.gender == e.target.value,
        )
        setSecondCategories(filteredSecondCategories)
    }
    // secondCategory選択時にthirdCategory表示
    const handleSecondCategoryChange = (e, parent_id, name) => {
        e.preventDefault()
        setStateSecondCategories(false)
        const filteredThirdCategories = thirdCategories.filter(
            category =>
                category.parent === parent_id &&
                (gender === true
                    ? category.gender == 2 || category.gender == 1
                    : category.gender == 2 || category.gender == 0),
        )
        setThirdCategories(filteredThirdCategories)
        setSecondCategoriesName(name)
    }
    // thirdCategory選択時にcategory_idカラムのstate更新
    const handleThirdCategoryChange = (e, id, name) => {
        e.preventDefault()
        setCategoryModalOpen(false)
        setThirdCategoriesName(name)
        onChange({ ...form, category_id: id })
    }

    // postage更新関数
    const handlePostageChange = e => {
        if (e.target.value === 'true') {
            onChange({ ...form, [e.target.name]: true })
        } else if (e.target.value === 'false') {
            onChange({ ...form, [e.target.name]: false })
        }
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
    const handleColorChange = colorName => {
        onChange({ ...form, color: colorName })
        setColorModalOpen(false)
    }
    const handleColorModalButtonClick = e => {
        e.preventDefault()
        setColorModalOpen(true)
    }
    const colorClear = e => {
        e.preventDefault()
        onChange({ ...form, color: '' })
    }

    return (
        <div className={styles.itemCard}>
            <div className={styles.cardContainer}>
                <h2>アイテム {index + 1}</h2>

                <input
                    id={`itemImageInput${index}`}
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleItemImageChange}
                    hidden
                    required
                />
                <div className={styles.imageContainer}>
                    {images
                        ? images.map((image, i) => (
                              <ExhibitImage
                                  key={i}
                                  index={i}
                                  src={URL.createObjectURL(image)}
                                  onDelete={e => handleDeleteItemImage(e, i)}
                              />
                          ))
                        : null}
                    {Array.from({
                        length: 6 - images.length,
                    }).map((defaultImage, i) => (
                        <label
                            htmlFor={`itemImageInput${index}`}
                            className="cursor-pointer"
                            key={i + images.length}>
                            <ExhibitDefaultImage
                                index={i + images.length}
                                src="default.jpg"
                            />
                        </label>
                    ))}
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
                        defaultValue={title}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.colorSelect}>
                    <div className={styles.categoryBox}>
                        <button
                            className={styles.categoryModalButton}
                            onClick={handleCategoryModalButtonClick}>
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
                        {gender !== '' && category_id !== '' ? (
                            <>
                                <p>{gender ? 'メンズ' : 'レディース'}/</p>
                                <p>{secondCategoriesName}/</p>
                                <p>{thirdCategoriesName}</p>
                            </>
                        ) : null}
                    </div>
                    {categoryModalOpen && (
                        <div>
                            <div
                                className={styles.modalBackground}
                                onClick={() =>
                                    setCategoryModalOpen(false)
                                }></div>
                            <div className={styles.modal}>
                                {stateFirstCategories ? (
                                    <>
                                        <button
                                            className={styles.categoryList}
                                            value={1}
                                            onClick={handleFirstCategoryChange}>
                                            <p>メンズ</p>
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
                                            className={styles.categoryList}
                                            value={0}
                                            onClick={handleFirstCategoryChange}>
                                            <p>レディース</p>
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
                                    </>
                                ) : (
                                    <>
                                        {stateSecondCategories
                                            ? SecondCategories.map(
                                                  (category, index) => (
                                                      <button
                                                          key={index}
                                                          className={
                                                              styles.categoryList
                                                          }
                                                          onClick={e =>
                                                              handleSecondCategoryChange(
                                                                  e,
                                                                  category.parent,
                                                                  category.name,
                                                              )
                                                          }>
                                                          <p>{category.name}</p>
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
                                                  ),
                                              )
                                            : ThirdCategories.map(
                                                  (category, index) => (
                                                      <button
                                                          key={index}
                                                          className={
                                                              styles.categoryList
                                                          }
                                                          onClick={e =>
                                                              handleThirdCategoryChange(
                                                                  e,
                                                                  category.id,
                                                                  category.name,
                                                              )
                                                          }>
                                                          <p>{category.name}</p>
                                                      </button>
                                                  ),
                                              )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.labelInputBox}>
                    <label htmlFor="text">
                        商品の説明<span className={styles.span}>任意</span>
                    </label>
                    <Textarea
                        id="text"
                        name="text"
                        placeholder="商品情報を入力"
                        defaultValue={text}
                        onChange={handleChange}
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
                            defaultValue={price}
                            placeholder="必須 ¥300 ~"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    {price < 300 && price !== '' ? (
                        <p className={styles.priceError}>
                            価格は¥300以上にしてください
                        </p>
                    ) : null}
                </div>

                <div className={styles.colorSelect}>
                    <button
                        className={styles.modalButton}
                        onClick={handleColorModalButtonClick}>
                        {color === '' ? 'カラー選択' : `${color}`}
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
                    {colorModalOpen && (
                        <div>
                            <div
                                className={styles.modalBackground}
                                onClick={() => setColorModalOpen(false)}></div>
                            <div className={styles.modal}>
                                {colors.map((color, index) => (
                                    <img
                                        key={index}
                                        src={`color/color_${color}.png`}
                                        onClick={e => handleColorChange(color)}
                                        className={styles.modalColorImage}
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
                        defaultValue={size}
                        className={styles.select}
                        onChange={handleChange}>
                        <option hidden>選択してください</option>
                        <option value="XXS以下">XXS以下</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="2XL">2XL</option>
                        <option value="3XL">3XL</option>
                        <option value="4XL以上">4XL以上</option>
                        <option value="FREE">FREE</option>
                    </select>
                </div>

                <div className={styles.selectBox}>
                    <label htmlFor="condition">商品の状態</label>
                    <select
                        name="condition"
                        id="condition"
                        required
                        defaultValue={condition}
                        className={styles.select}
                        onChange={handleChange}>
                        <option hidden>選択してください</option>
                        <option value="新品未使用">新品未使用</option>
                        <option value="未使用に近い">未使用に近い</option>
                        <option value="目立った傷や汚れなし">
                            目立った傷や汚れなし
                        </option>
                        <option value="やや傷や汚れあり">
                            やや傷や汚れあり
                        </option>
                        <option value="傷や汚れあり">傷や汚れあり</option>
                        <option value="全体的に状態が悪い">
                            全体的に状態が悪い
                        </option>
                    </select>
                </div>

                <div className={styles.selectBox}>
                    <label htmlFor="days">発送までの日数</label>
                    <select
                        name="days"
                        id="days"
                        required
                        defaultValue={days}
                        className={styles.select}
                        onChange={handleChange}>
                        <option hidden>選択してください</option>
                        <option value="1~2日で発送">1~2日で発送</option>
                        <option value="2~3日で発送">2~3日で発送</option>
                        <option value="4~7日で発送">4~7日で発送</option>
                    </select>
                </div>

                <div className={styles.selectBox}>
                    <label htmlFor="postage">配送料の負担</label>
                    <select
                        name="postage"
                        id="postage"
                        required
                        defaultValue={postage}
                        className={styles.select}
                        onChange={handlePostageChange}>
                        <option value="true">送料込み</option>
                        <option value="false">着払い</option>
                    </select>
                </div>

                <div className={styles.selectBox}>
                    <label htmlFor="url">商品URL</label>
                    <input
                        id="url"
                        type="text"
                        name="url"
                        className={styles.price}
                        defaultValue={url}
                        placeholder="必須"
                        required
                        onChange={handleChange}
                    />
                </div>

                {index !== 0 ? (
                    <div className={styles.deleteButtonBox}>
                        <button
                            className={styles.deleteButton}
                            onClick={() => onDelete(index)}>
                            アイテム{index + 1}を削除
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ExhibitItem
