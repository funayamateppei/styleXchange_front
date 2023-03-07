import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'

const Home = () => {
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home
                </h2>
            }>
            <Head>
                <title>Home</title>
            </Head>
        </AppLayout>
    )
}

export default Home
