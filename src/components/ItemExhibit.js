import React from 'react'
import styles from '@/styles/components/ItemExhibit.module.css'
import { useState } from 'react'

import Textarea from '@/components/Textarea'
import ExhibitImage from '@/components/ExhibitImage'
import ExhibitDefaultImage from '@/components/ExhibitDefaultImage'

const ItemExhibit = ({ index, form, onChange }) => {
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
        images,
    } = form

    // ItemImages更新関数
    const handleItemImageChange = e => {
        const files = Array.from(e.target.files)
        if (files.length <= 10) {
            onChange({ ...form, [e.target.name]: [...images, ...files] })
        } else {
            alert('画像は10枚までしか選択できません')
        }
    }

    // ItemImages削除関数
    const handleDeleteItemImage = index => {
        const newItemImages = [...images] // 画像配列のコピーを作成
        newItemImages.splice(index, 1) // 指定されたインデックスの画像を削除
        onChange({ ...form, images: newItemImages }) // 画像配列を更新
    }

    // 更新関数
    const handleChange = e => {
        onChange({ ...form, [e.target.name]: e.target.value })
    }

    // postage更新関数
    const handlePostageChange = e => {
        if (e.target.value === 'true') {
            onChange({ ...form, [e.target.name]: true })
        } else if (e.target.value === 'false') {
            onChange({ ...form, [e.target.name]: false })
        }
    }

    // 色選択関数
    const [isModalOpen, setIsModalOpen] = useState(false)
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
        setIsModalOpen(false)
    }
    const handleButtonClick = () => {
        setIsModalOpen(true)
    }
    const colorClear = () => {
        onChange({ ...form, color: '' })
    }

    return (
        <div className={styles.itemCard}>
            <div className={styles.cardContainer}>
                <h2>アイテム {index + 1}</h2>

                <input
                    id="itemImageInput"
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
                        ? images.map((image, index) => (
                              <ExhibitImage
                                  key={index}
                                  index={index}
                                  src={URL.createObjectURL(image)}
                                  onDelete={e =>
                                      handleDeleteItemImage(e, index)
                                  }
                              />
                          ))
                        : null}
                    {Array.from({
                        length: 10 - images.length,
                    }).map((defaultImage, index) => (
                        <label
                            htmlFor="itemImageInput"
                            className="cursor-pointer"
                            key={index + images.length}>
                            <ExhibitDefaultImage
                                index={index + images.length}
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

                <div className={styles.colorSelect}>
                    <button
                        className={styles.colorModalButton}
                        onClick={handleButtonClick}>
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
                    {isModalOpen && (
                        <div>
                            <div
                                className={styles.modalBackground}
                                onClick={() => setIsModalOpen(false)}></div>
                            <div className={styles.modal}>
                                {colors.map(color => (
                                    <img
                                        key={color.id}
                                        src={`color/color_${color}.png`}
                                        onClick={() => handleColorChange(color)}
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
                        defaultValue={postage}
                        className={styles.select}
                        onChange={handlePostageChange}>
                        <option value="true">送料込み</option>
                        <option value="false">着払い</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default ItemExhibit
