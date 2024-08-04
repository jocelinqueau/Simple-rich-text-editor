import './style.css'

const app = document.getElementById('app')

const nodes = new Map<string, any>();


if(app){
  app.addEventListener('focusin', (e) => {
    const text = {
      type: 'text',
      text: '',
    }

    const root = {
      type: 'root',
      children: [text],
    }

    nodes.set('root', root);
  });
  app.addEventListener('beforeinput', (e) => {
    const inputType = e.inputType;

    switch(inputType){
      case 'insertText':{
        const text = e.data;
        console.log(text);
        break;
      }
      case 'formatBold':{
        const selection = window.getSelection();
        console.log(selection);
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const startNode = range.startContainer;
          const endNode = range.endContainer;

          // Assuming we're working with the 'root' node for simplicity
          const root = nodes.get('root');
          if (root && root.children) {
            // Find the text node that contains the selection
            const textNode = root.children.find((child: any) => child.type === 'text');
            if (textNode) {
              // Update the text node to make it bold
              textNode.bold = true;
              console.log('Text node updated:', textNode);
            }
          }
        }
        break;
      }
      default: {
        console.log("TODO?", inputType);
      }
    }
  })
}