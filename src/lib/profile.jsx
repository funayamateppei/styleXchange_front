import axios from '@/lib/axios'

export async function getMyData() {
    const response = await axios.get('/api/my/data')
    const data = await response.data
    return data
}

export async function getAllData() {
    const response = await axios.get('/api/my/allData')
    const data = await response.data
    return data
}

export async function getAllDataIds() {
    const response = await axios.get('/api/my/allData')
    const data = await response.data
    return await data.map(data => {
        return {
            params: {
                id: String(data.id),
            },
        }
    })
}

export async function getUserData(id) {
    const response = await axios.get(`/api/my/allData/${id}`)
    const data = await response.data
    return data
}
