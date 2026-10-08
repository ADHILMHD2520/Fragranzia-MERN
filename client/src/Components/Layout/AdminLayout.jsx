import Sidebar from "../Admin/Sidebar/Sidebar";


const AdminLayout = ({ children }) => {

    return (
        <>
            <div className="flex h-screen bg-gray-100 class-main">
                <Sidebar />

                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </div>
        </>
    )
}

export default AdminLayout