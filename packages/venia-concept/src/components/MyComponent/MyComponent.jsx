import React from 'react'
import myStyles from './myStyles.module.css'

export default function myComponent() {
  return (
    <blockquote className={myStyles.blockquote}>This is a custom component</blockquote>
  )
}