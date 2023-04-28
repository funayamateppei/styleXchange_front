import React from 'react'
import styles from '@/styles/components/Slider.module.css'

import '@splidejs/splide/css'
import { Splide, SplideSlide } from '@splidejs/react-splide'

const Slider = ({ images }) => {
    return (
        <>
            <Splide
                aria-label="画像集"
                options={{
                    autoplay: false, // 自動再生を無効
                }}>
                {images &&
                    images.map((image, index) => (
                        <SplideSlide key={index}>
                            <img
                                className={styles.img}
                                src={`${process.env.NEXT_PUBLIC_AWS_URL}${image.path}`}
                                alt={image.original_file_name}
                            />
                        </SplideSlide>
                    ))}
            </Splide>
        </>
    )
}

export default Slider
