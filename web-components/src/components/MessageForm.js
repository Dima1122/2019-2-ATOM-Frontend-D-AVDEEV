/* eslint-disable no-underscore-dangle */
const template = document.createElement('template')
template.innerHTML = `
    <style>
        
        :host {
            width: 100%;
            height: 100%;
            font-family: sans-serif;
            background-color: #CFD0D1 ;
            display: flex;
            flex-direction: column;
        }
        .header{
            width: 100%;
            background-color: #29384B;
            z-index: 1;
        }
        
        .chat {
            width: 100%;
            display: flex;
            flex: auto;
            flex-direction: column-reverse;
            align-content: flex-end;
            z-index: 0;
            overflow-y: auto;
        }
        .messagesList{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-end;
            flex-direction: column;
        }
        .message-item{
            box-sizing: border-box;
            width: 100%;
            padding: 0 10px 20px 10px;
        }
        .inputFrom {
            width: 100%;
            background-color: #29384B;
            
            z-index: 1;
        }
        
        ::-webkit-scrollbar-track
        {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          border-radius: 10px;
          background-color: #29384B;
        }
        ::-webkit-scrollbar
        {
          width: 12px;
          background-color: #29384B;
        }
        ::-webkit-scrollbar-thumb
        {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
          background-color: #D62929;
        }
        
        input[type=submit] {
            visibility: visible;
        }
    </style>
    
    <div class='header'>
        <chat-header>
        </chat-header>
    </div>
    <div class='chat'>
        <div class='messagesList'>
        </div>
    </div>
    <div class='inputForm'>
        <form>
            <form-input name="message-text" placeholder="Message..."></form-input>
        </form>
    </div>
`

class MessageForm extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    this.$form = this._shadowRoot.querySelector('form')

    this.$input = this._shadowRoot.querySelector('form-input')
    this.$messagesList = this._shadowRoot.querySelector('.messagesList')
    this.$header = this._shadowRoot.querySelector('chat-header')
    this.$form.addEventListener('keypress', this._onKeyPress.bind(this))
    this.$form.addEventListener('submit', this._onSubmit.bind(this))
    this.$input.addEventListener('ButtonClick', this._onSubmit.bind(this))
  }

  _onSubmit(event) {
    event.preventDefault()
    if (this.$input.value.length > 0) {
      const $message = this.generateMessage()
      this.$input.$input.value = ''
      this.$messagesList.appendChild($message)
      const msgobj = $message.toObject()
      this.messages.push(msgobj)
      localStorage.setItem(`dialogue#${this.dialogueID}-${this.dialogueName}`, JSON.stringify(this.messages))
      this.$input.dispatchEvent(new Event('onSubmit'))
    }
  }

  generateMessage(senderName = 'Avdeev Dmitry', message = this.$input.value, timestamp = null) {
    const messageItem = document.createElement('message-item')
    if (timestamp) {
      messageItem.setAttribute('timestamp', timestamp)
    }
    messageItem.setAttribute('message', message)
    messageItem.setAttribute('name', senderName)

    return messageItem
  }

  clrscr() {
    this.$messagesList.innerHTML = ''
  }

  render() {
    if (`dialogue#${this.dialogueID}-${this.dialogueName}` in localStorage) {
      this.messages = JSON.parse(localStorage.getItem(`dialogue#${this.dialogueID}-${this.dialogueName}`))
    } else {
      this.messages = []
    }
    this.messages.forEach((msg) => {
      const $message = this.generateMessage(msg.name, msg.message, msg.timestamp)
      this.$messagesList.appendChild($message)
    })
  }

  _onKeyPress(event) {
    if (event.keyCode === 13) {
      this.$form.dispatchEvent(new Event('submit'))
    }
  }

  static get observedAttributes() {
    return ['dialoguename', 'dialogueid']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // eslint-disable-next-line default-case
    switch (name) {
      case 'dialoguename':
        this.dialogueName = newValue
        break
      case 'dialogueid':
        this.dialogueID = newValue
        break
    }
  }
}

customElements.define('message-form', MessageForm)
