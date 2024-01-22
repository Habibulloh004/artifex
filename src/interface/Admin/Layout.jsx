import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/reports")
  },[])
  return (
    <div>Admin</div>
  )
}

export default Layout