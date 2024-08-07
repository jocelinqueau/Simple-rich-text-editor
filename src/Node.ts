export class Node {
  protected _type: string | null = null;
  public _children: Node[];
  public _flags: number;
  protected _key: string | null = null;
  protected _parent: Node | null = null;
  protected _style: any = null;

  constructor(flags: number = 0, children: Node[] = []) {
    this._children = children;
    this._flags = flags;
  }

  render(): string {
    return this._children.map(child => child.render()).join('');
  }
}

export class RootNode extends Node {
  constructor(children: Node[] = []) {
    super(0, children);
    this._type = 'root';
  }

  render(): string {
    return `<div>${super.render()}</div>`;
  }
}

export class TextNode extends Node {
  private _text: string;
  public _selectionStart: number = 0;
  public _selectionEnd: number = 0;

  constructor(text: string = '', flags: number = 0) {
    super(flags);
    this._type = 'text';
    this._text = text;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  select(start: number, end: number): void {
    this._selectionStart = start;
    this._selectionEnd = end;
  }

  render(): string {
    let text = this._text;
    if (this._flags & 1) { // Assuming flag 1 is for bold
      text = `<strong>${text}</strong>`;
    }
    return `<span>${text}</span>`;
  }
}

export class ParagraphNode extends Node {
  constructor(children: Node[] = []) {
    super(0, children);
    this._type = 'paragraph';
  }

  render(): string {
    return `<p>${super.render()}</p>`;
  }
}