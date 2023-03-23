import React from 'react'

const Layout = ({children}) => {
    return (
        <div className="min-h-screen bg-gray-100 h-full">
            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default Layout
