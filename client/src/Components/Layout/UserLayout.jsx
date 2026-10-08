import React from 'react'
// import UserNavBar from '../../user/UserNavBar'
import UserNavBar from '../../Components/User/Navbar/Navbar'
import UserFooter from '../../Components/User/Footer/Footer'

const UserLayout = ({ children }) => {
  return (
    <>
    {/* <div className="container mx-auto  mt-5"> */}
      <UserNavBar />
      {children}
      <UserFooter/>
    </>
  )
}

export default UserLayout
