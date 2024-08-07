import './style.css'
import { RootNode, TextNode, ParagraphNode } from './Node';

const app = document.getElementById('app')
const status = document.getElementById('status')
const render = document.getElementById('render')
const debug = document.getElementById('debug')
const debugSelection = document.getElementById('debug-selection')

let rootNode = new RootNode([new ParagraphNode([new TextNode()])]);

const insertParagraph = (currentParagraph: ParagraphNode, textNode: TextNode) => {
  const newParagraph = new ParagraphNode([new TextNode()]);
  const currentParagraphIndex = rootNode._children.indexOf(currentParagraph);

  if (textNode.text.length > 0) {
    // Split the current text node
    const splitIndex = textNode._selectionStart;
    const newTextNode = new TextNode(textNode.text.slice(splitIndex));
    textNode.text = textNode.text.slice(0, splitIndex);
    newParagraph._children[0] = newTextNode;
  }

  rootNode._children.splice(currentParagraphIndex + 1, 0, newParagraph);
  updateStatus('New paragraph created');
};

if (app) {
  app.addEventListener('focusin', () => {
    updateStatus('Editor focused. Ready for input.');
  });

  app.addEventListener('beforeinput', (e: InputEvent) => {
    console.log('beforeinput', e);
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
      case 'insertParagraph': {
        console.log('insertParagraph');
        insertParagraph(currentParagraph, textNode);
        break;
      }
      case 'insertLineBreak': {
        console.log('insertLineBreak');
        e.preventDefault();
        insertParagraph(currentParagraph, textNode);
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

  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    console.log("selection", selection);
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      const startParagraph = startContainer.nodeType === Node.TEXT_NODE ? startContainer.parentElement : startContainer as Element;
      const endParagraph = endContainer.nodeType === Node.TEXT_NODE ? endContainer.parentElement : endContainer as Element;

      console.log("selection", startParagraph, endParagraph);

      const content = {
        startContainer: serializeNode(startContainer),
        endContainer: serializeNode(endContainer),
        startParagraph: serializeNode(startParagraph),
        endParagraph: serializeNode(endParagraph),
      }

      if (debugSelection) {
        debugSelection.textContent = JSON.stringify(content, null, 2);
      }
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
    render.innerHTML = rootNode.render();
  }
}

const _updateDebug = () => {
  if (debug) {
    debug.textContent = JSON.stringify(rootNode, null, 2);
  }
}

const serializeNode = (node: Node | Element) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return {
      type: 'text',
      textContent: node.textContent,
    };
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    return {
      type: 'element',
      tagName: element.tagName,
      id: element.id,
      className: element.className,
    };
  }
  return {
    type: 'unknown',
  };
};

// Initial render and debug update
_render();
_updateDebug();