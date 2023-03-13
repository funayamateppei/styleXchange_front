import React from 'react'
import { useState } from 'react'


const follow = () => {
    // フォロー中表示かフォロワー表示の状態管理
    // trueがフォロワー falseがフォロー中
    const [mode, setMode] = useState(true)
    const modeChangeThread = () => {
        setMode(true)
    }
    const modeChangeItem = () => {
        setMode(false)
    }
    return <div>follow</div>
}

export default follow