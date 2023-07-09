import { ActionPanel, Icon, Form, Action, Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { convert } from "./converter";

interface FormInput {
  input: string;
  result: string;
}

export default function main() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const onChange = function (newValue: string) {
    setInput(newValue);
    const output = convert(newValue);
    showToast({
      style: Toast.Style.Success,
      title: "Successfully converted",
    });
    setResult(output);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Copy to clipcoard"
            icon={Icon.Clipboard}
            onSubmit={async (values: FormInput) => {
              const output = convert(values.input);
              await Clipboard.copy(output);
              await showHUD("✅ Converted succesfully!");
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title="Input"
        placeholder="Paste GLSL Sandbox code here…"
        value={input}
        onChange={onChange}
      />
      <Form.TextArea id="result" title="Result" placeholder="Command + Enter to copy to clipboard…" value={result} />
    </Form>
  );
}
