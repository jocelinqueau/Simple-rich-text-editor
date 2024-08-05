import './style.css'

const app = document.getElementById('app')
const status = document.getElementById('status')
const render = document.getElementById('render')

const nodes = new Map<string, any>();

const nodeTypes = [
  {
    type: 'root',
    children: [] as any[],
    render: function() {
      return `<div>${this.children.map(child => child.render()).join('')}</div>`;
    }
  },
  {
    type: 'text',
    text: '',
    bold: false,
    select: function(start: number, end: number) {
      this.selectionStart = start;
      this.selectionEnd = end;
    },
    render: function() {
      let text = this.text;
      if (this.bold) {
        text = `<strong>${text}</strong>`;
      }
      return `<span>${text}</span>`;
    }
  }
];

const createNode = (type: string) => {
  const nodeType = nodeTypes.find(nt => nt.type === type);
  return Object.assign({}, nodeType);
}

if (app) {
  app.addEventListener('focusin', () => {
    const root = createNode('root');
    const text = createNode('text');
    root.children.push(text);
    nodes.set('root', root);
    updateStatus('Editor focused. Ready for input.');
  });

  app.addEventListener('beforeinput', (e: InputEvent) => {
    const inputType = e.inputType;
    const root = nodes.get('root');
    const textNode = root.children[0]; // Assuming only one text node for simplicity

    switch (inputType) {
      case 'insertText': {
        const text = e.data;
        textNode.text += text;
        updateStatus(`Text inserted: ${text}`);
        break;
      }
      case 'deleteContentBackward': {
        textNode.text = textNode.text.slice(0, -1);
        updateStatus('Text deleted');
        break;
      }
      case 'formatBold': {
        e.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const start = range.startOffset;
          const end = range.endOffset;
          textNode.bold = !textNode.bold; // Toggle bold
          textNode.select(start, end);
          updateStatus('Text formatted as bold');
        }
        break;
      }
      default: {
        console.log("Unhandled input type:", inputType);
        updateStatus(`Unhandled input type: ${inputType}`);
      }
    }
    _render();
  });

  app.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const root = nodes.get('root');
      const textNode = root.children[0]; // Assuming only one text node for simplicity
      textNode.select(range.startOffset, range.endOffset);
    }
  });
}

const updateStatus = (message: string) => {
  if (status) {
    status.textContent = message;
  }
}

const _render = () => {
  if (render) {
    const root = nodes.get('root');
    render.innerHTML = root.render();
  }
}