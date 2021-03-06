import React from 'react'
import { DialogueForm } from './DialogueForm'
import { MessageForm } from './MessageForm'
import { Profile } from './Profile'
import MyContext from './MyContext.Context'
import styles from '../styles/MainForm.module.css'

export class MainForm extends React.Component {
  constructor(props) {
    super(props)
    const storage = this.parseStorage()
    this.state = {
      chats: storage.chats,
      messages: storage.messages,
      chatCounter: storage.chatCounter,
      currentDialogue: null,
      flag: 0,
      frameStyles: {
        MessageForm: { animationName: styles.chatDisappear, display: 'none' },
        Profile: { animationName: styles.chatDisappear, display: 'none' },
      },
    }
  }

  parseStorage() {
    const storage = {
      chats: JSON.parse(localStorage.getItem('chats')),
      messages: JSON.parse(localStorage.getItem('messages')),
      chatCounter: JSON.parse(localStorage.getItem('chatCounter')),
    }
    if (!storage.chats) {
      storage.chats = []
      storage.messages = {}
      storage.chatCounter = 0
    }
    return storage
  }

  openDialogue(chatId) {
    const { state } = this
    state.frameStyles.MessageForm = {
      animationName: styles.chatAppearance,
      display: 'flex',
    }
    state.currentDialogue = chatId
    if (state !== this.state) {
      this.setState(state)
    }
  }

  closeDialogue(frame = null) {
    const { state } = this
    if (!frame) {
      Object.keys(state.frameStyles).forEach((index) => {
        state.frameStyles[index] = {
          animationName: styles.chatDisappear,
          display: 'flex',
        }
      })
    } else {
      state.frameStyles[frame] = {
        animationName: styles.chatDisappear,
      }
    }
    if (state !== this.state) {
      this.setState(state)
    }
  }

  messageHandler(value, chatTimestamp = null, chatId = null, attachments = null) {
    let { currentDialogue, messages } = this.state
    // eslint-disable-next-line no-unused-vars
    let isAttached = false
    if (!messages) {
      messages = {}
    }
    if (chatId) {
      currentDialogue = chatId
      messages[currentDialogue - 1] = []
    }

    const message = {
      id: 'test',
      content: value,
      amISender: true,
      time: chatTimestamp || new Date(),
      status: 'sent',
    }
    if (attachments) {
      message.attachments = attachments
      isAttached = true

      const data = new FormData()
      data.append(Attr.type, attachments.file)

      fetch('https://tt-front.now.sh/upload', {
        method: 'POST',
        body: data,
      })
        .then(() => {
          // pass
          // eslint-disable-next-line no-console
        })
        .catch(console.log)
    }
    messages[currentDialogue - 1].push(message)
    this.setState(messages)
    if (!chatId) {
      this.setLastMessage()
    }
    localStorage.setItem('messages', JSON.stringify(messages))
  }

  createHandler() {
    let { chats, chatCounter } = this.state
    const name = prompt('Enter person name')
    const text = prompt('Write a message')
    chatCounter += 1
    this.messageHandler(text, new Date(), chatCounter)
    const chatMsgs = this.state.messages[chatCounter - 1]
    chats.push({
      id: chatCounter,
      title: name,
      is_group: false,
      host: 'Avdeev Dmitry',
      lastMessage: chatMsgs[chatMsgs.length - 1],
    })
    this.setState({ chats, chatCounter })
    this.setLastMessage(chatCounter)
    localStorage.setItem('chats', JSON.stringify(chats))
    localStorage.setItem('chatCounter', JSON.stringify(chatCounter))
  }

  setLastMessage(chatId = null) {
    const { messages, chats } = this.state
    let { currentDialogue } = this.state
    if (chatId) {
      currentDialogue = chatId
    }
    const chatMessages = messages[currentDialogue - 1]
    chats[currentDialogue - 1].lastMessage = chatMessages[chatMessages.length - 1]
    this.setState(chats)
    localStorage.setItem('chats', JSON.stringify(chats))
  }

  openProfile() {
    const { state } = this
    state.frameStyles.Profile = {
      animationName: styles.chatAppearance,
      display: 'flex',
    }
    if (state !== this.state) {
      this.setState(state)
    }
  }

  pageRouter() {
    const path = this.props.location.pathname
    switch (true) {
      case /chat\/\d\/?$/.test(path):
        const chatid = parseInt(path.match(/\d+/), 10)
        this.openDialogue(chatid)
        break
      case /profile\/\d\/?$/.test(path):
        this.openProfile()
        break
      case this.state.flag === 0:
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.flag = 1
        break
      default:
        this.closeDialogue()
        break
    }
  }

  render() {
    this.pageRouter()
    const { state } = this
    return (
      <MyContext.Provider value={this}>
        <div className={styles.container}>
          <DialogueForm chats={state.chats} />
          <MessageForm
            style={state.frameStyles.MessageForm}
            details={state.currentDialogue && state.chats[state.currentDialogue - 1]}
            messages={state.currentDialogue && state.messages[state.currentDialogue - 1]}
          />
          <Profile style={state.frameStyles.Profile} />
        </div>
      </MyContext.Provider>
    )
  }
}
