import React from 'react'
import styles from '@/styles/components/Header.module.css'
import { useRouter } from 'next/router'

const Header = ({ children }) => {
  const router = useRouter();
  return (
      <>
          <div className={styles.header}>
              <div
                  className="flex justify-center cursor-pointer h-16 items-center ml-4 w-12"
                  onClick={() => {
                      router.back()
                  }}>
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-6 h-6`}>
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                      />
                  </svg>
              </div>
              {/* Page Content */}
          </div>
          <main>{children}</main>
      </>
  )
}

export default Header