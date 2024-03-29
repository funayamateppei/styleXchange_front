import { useRouter } from 'next/router'
import { useEffect } from 'react'

const IndexPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.replace('/home')
    }, [])

    return <div>Redirecting...</div>
}

export default IndexPage
