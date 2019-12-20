import React from 'react'
import styles from '../styles/FormInput.module.css'

export function FormInput(props) {
  const input = React.useRef(null)
  const { messageHandler } = props

  const onSubmit = () => {
    const value = input.current.value.trim()
    if (value !== '') {
      input.current.value = ''
      messageHandler(value)
    }
  }

  const onKeyPress = (event) => {
    if (event.charCode === 13) {
      onSubmit()
    }
  }

  return (
    <div className={styles.formInput}>
      <div className={styles.clip} />
      <input onKeyPress={onKeyPress} ref={input} placeholder="Hello..." />
      <button onClick={onSubmit} className={styles.btn}>
        send
      </button>
    </div>
  )
}