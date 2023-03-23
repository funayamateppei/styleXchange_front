import React from 'react'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import { useEffect } from 'react'
import axios from '@/lib/axios'

const Comment = ({ id, datalist }) => {
    const { user } = useAuth({ middleware: 'auth' })

    // CSRで最新の情報を取得
    const fetcher = url => {
        return axios(url).then(response => response.data)
    }
    const apiUrl = `/api/threads/comments/${id}`
    const { data: data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: datalist,
    })
    useEffect(() => {
        mutate()
    }, [])

    console.log(data)

    return (
        <div>
            <button>thread comment</button>
        </div>
    )
}

export async function getAllThreadIds() {
    const response = await axios.get('/api/threads/ids')
    const threads = await response.data
    return await threads.map(thread => {
        return {
            params: {
                id: String(thread.id),
            },
        }
    })
}

export async function getStaticPaths() {
    const paths = await getAllThreadIds()
    return {
        paths,
        fallback: true,
    }
}

export async function getThreadCommentData(id) {
    const response = await axios.get(`/api/threads/comments/${id}`)
    const data = await response.data
    return data
}

export async function getStaticProps({ params }) {
    const data = await getThreadCommentData(params.id)
    const id = data.threadData.id
    return {
        props: {
            id: id,
            datalist: data,
        },
        revalidate: 3,
    }
}

export default Comment
