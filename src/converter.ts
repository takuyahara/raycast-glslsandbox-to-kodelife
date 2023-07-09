import tokenizeString, { Token } from "glsl-tokenizer/string";

class GlslToken {
  private tokens: Token[] = [];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  removeUnsupportedPreprocessor() {
    const { tokens } = this;
    const newTokens: Token[] = [];
    for (const t of tokens) {
      if (t.type === "preprocessor") {
        const pp = t.data.trim().split(/ +/);
        if (pp[0] === "#extension" && pp[1] === "GL_OES_standard_derivatives") {
          continue;
        }
      }
      newTokens.push(t);
    }
    this.tokens = newTokens;
    return this;
  }
  removeUnsupportedCode() {
    const { tokens } = this;
    const newTokens: Token[] = [];
    for (let i = 0, l = tokens.length; i < l; i++) {
      const t = tokens[i];
      if (t.type === "keyword" && t.data === "varying") {
        const line = t.line;
        for (let j = i + 1; j < l; j++) {
          if (tokens[j].line !== line) {
            i = j - 1;
            break;
          }
          i = j;
        }
        continue;
      }
      newTokens.push(t);
    }
    this.tokens = newTokens;
    return this;
  }
  replaceFragCoord() {
    const { tokens } = this;
    const newTokens: Token[] = [];
    for (const t of tokens) {
      if (t.type === "preprocessor" && /gl_FragColor$/.test(t.data.trim())) {
        t.data = t.data.trim().replace(/gl_FragColor$/, "fragColor");
      }
      if (t.type === "builtin" && t.data === "gl_FragColor") {
        t.data = "fragColor";
      }
      newTokens.push(t);
    }
    this.tokens = newTokens;
    return this;
  }
  removeEof() {
    const { tokens } = this;
    const newTokens: Token[] = [];
    for (const t of tokens) {
      if (t.type !== "eof") {
        newTokens.push(t);
      }
    }
    this.tokens = newTokens;
    return this;
  }
  toString() {
    const { tokens } = this;
    return tokens.map((t) => t.data).join("");
  }
}

export function convert(src: string): string {
  const HEADERS = `#version 150

out vec4 fragColor;

`;
  const tokenString = tokenizeString(src);
  const tokensConverted = new GlslToken(tokenString)
    .removeUnsupportedPreprocessor()
    .removeUnsupportedCode()
    .replaceFragCoord()
    .removeEof();
  const srcConverted = HEADERS + tokensConverted.toString();
  return srcConverted;
}
