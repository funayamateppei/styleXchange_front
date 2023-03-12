import styles from '@/styles/index.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            <Head>
                <title>login</title>
            </Head>

            <div className={styles.container}>
                <div className={styles.buttonContainer}>
                    {user ? (
                        <Link
                            href="/home"
                            className={styles.button}>
                            Home
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`${styles.button} ${styles.marginRight}`}>
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className={styles.button}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
            
            <button onClick={() => {
                axios.get('/api/hoge').then((res) => {
                    console.log(res);
                })
            }}>ボタン</button>
        </>
    )
}
