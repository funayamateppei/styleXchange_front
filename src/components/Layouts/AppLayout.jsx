import Navigation from '@/components/Layouts/Navigation'

const AppLayout = ({ user, children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
