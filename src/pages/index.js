import styles from '@/styles/index.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

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
                            href="/dashboard"
                            className={styles.button}>
                            Dashboard
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
        </>
    )
}
