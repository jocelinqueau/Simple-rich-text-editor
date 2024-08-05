import './style.css'
import { RootNode, TextNode, ParagraphNode } from './Node';

const app = document.getElementById('app')
const status = document.getElementById('status')
const render = document.getElementById('render')
const debug = document.getElementById('debug')

let rootNode = new RootNode([new ParagraphNode([new TextNode()])]);

if (app) {
  app.addEventListener('focusin', () => {
    updateStatus('Editor focused. Ready for input.');
  });

  app.addEventListener('beforeinput', (e: InputEvent) => {
    const inputType = e.inputType;
    const currentParagraph = rootNode._children[rootNode._children.length - 1] as ParagraphNode;
    const textNode = currentParagraph._children[0] as TextNode;

    switch (inputType) {
      case 'insertText': {
        const text = e.data;
        if (text) {
          textNode.text += text;
          updateStatus(`Text inserted: ${text}`);
        }
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
          textNode.select(range.startOffset, range.endOffset);
          textNode._flags ^= 1; // Toggle bold flag
          updateStatus('Text formatted as bold');
        }
        break;
      }
      case 'insertLineBreak': {
        e.preventDefault();
        console.log('insertLineBreak');
        const newParagraph = new ParagraphNode([new TextNode()]);
        rootNode._children.push(newParagraph);
        updateStatus('New paragraph created');
        break;
      }
      default: {
        console.log("Unhandled input type:", inputType);
        updateStatus(`Unhandled input type: ${inputType}`);
      }
    }
    _render();
    _updateDebug();
  });

  app.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = rootNode._children[0] as TextNode; // Assuming only one text node for simplicity
      textNode.select(range.startOffset, range.endOffset);
    }
    _updateDebug();
  });
}

const updateStatus = (message: string) => {
  if (status) {
    status.textContent = message;
  }
}

const _render = () => {
  if (render) {
    render.innerHTML = rootNode.render();
  }
}

const _updateDebug = () => {
  if (debug) {
    debug.textContent = JSON.stringify(rootNode, null, 2);
  }
}

// Initial render and debug update
_render();
_updateDebug();