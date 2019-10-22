const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        font-family: sans-serif;
        padding: 8px;
    }
    
    .message{
        display: flex;
        flex-flow: column nowrap;
        margin-right: 5px;
        float: right;
        padding: 10px;
        max-width: 90%;
        word-wrap: break-word;
        max-width: 300px
    }
   .message .text{
        padding: 8px 8px;
        background-color: rgb(0, 100, 0);
        border-radius: .8em;
        color: rgb(224, 255, 255);
   }
    .message .time{
        font-size: 12px;
        padding: 2px 8px;
        color: #999;
        align-self: flex-end;
    }
    .message .name{
      display: none;
    }
    
</style>
<div class="message">
    <div class='name'></div>
    <div class='text'></div>
    <div class='time'></div>
</div>
`;

class MessageItem extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$message = this._shadowRoot.querySelector('.message');

    this.$name = this._shadowRoot.querySelector('.name');
    this.$text = this._shadowRoot.querySelector('.text');
    this.$timestamp = this._shadowRoot.querySelector('.time');
  }

  static get observedAttributes() {
    return ['name', 'text', 'timestamp'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'text':
        this._text = newValue;
        break;
      case 'name':
        this._name = newValue;
        break;
      case 'timestamp':
        this._timestamp = newValue;
        break;
    }
    this._renderMessage();
  }

  toObject() {
    this.messageObject = {
      name: this.$name.innerHTML,
      text: this.$text.innerHTML,
      timestamp: this.$timestamp.innerHTML,
    };
    return this.messageObject;
  }

  _renderMessage() {
    this.$name.innerHTML = this._name;
    this.$text.innerHTML = this._text;
    var time = new Date();
    if (this._timestamp) {
      this.$timestamp.innerHTML = this._timestamp;
    } else {
      this.$timestamp.innerHTML = time.toLocaleString('ru', {
        hour: 'numeric',
        minute: 'numeric',
      });
    }
  }
}

customElements.define('message-item', MessageItem);
