declare module "glsl-tokenizer/string" {
  export default function tokenizeString(str: string, opt?: object): Token[];
  export type Token = {
    type: string;
    data: string;
    position: number;
    line: number;
    column: number;
  };
}
