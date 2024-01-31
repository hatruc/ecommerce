import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WrapperType } from './styled'

const Category = ({ category }) => {
  const navigate = useNavigate()
  const handleNavigate = (id) => {
    navigate(`/category/${id}`)
  }
  return (
    <WrapperType key={category._id} onClick={() => handleNavigate(category._id)}>{category.name}</WrapperType>
  )
}

export default Category