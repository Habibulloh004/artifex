import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/boss/menu")
  }, [])
  return (
    <div>boss</div>
  )
}

export default Layout