import React from 'react'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'

// const Comment = ({ id, commentData }) => {
const Comment = ({ id, commentData }) => {
  const { user } = useAuth({ middleware: 'auth' })
  
  const hoge = axios.get('/api/threads/comments/1')
  console.log(hoge)

    console.log(commentData)
    console.log(id)
    return <div>Comment</div>
}

// export async function getAllThreadIds() {
//     const response = await axios.get('/api/threads/ids')
//     const threads = await response.data
//     return await threads.map(thread => {
//         return {
//             params: {
//                 id: String(thread.id),
//             },
//         }
//     })
// }

// export async function getStaticPaths() {
//     const paths = await getAllThreadIds()
//     return {
//         paths,
//         fallback: true,
//     }
// }

// export async function getThreadCommentData(id) {
//     const response = await axios.get(`/api/threads/comments/${id}`)
//     const data = await response.data
//     return data
// }

// export async function getStaticProps({ params }) {
//     const data = await getThreadCommentData(params.id)
//     const id = data.id
//     return {
//         props: {
//             id: id,
//             commentData: data,
//         },
//         revalidate: 3,
//     }
// }

export default Comment
