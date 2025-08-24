import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/react";

export const MyImage = Image.extend({
  addOptions: () => {
    return {
      ...Image.options,
      sizes: ["inline", "block", "left", "right"],
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { style } = HTMLAttributes;

    return [
      "figure",
      { style },
      [
        "img",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          style: "display: initial; max-width: 100%;",
        }),
      ],
    ];
  },
});
