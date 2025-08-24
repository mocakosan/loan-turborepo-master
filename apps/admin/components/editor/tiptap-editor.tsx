"use client";

import React, { useEffect } from "react";

import { Color } from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
import BoldButton from "./_components/bold-button";
import ColorButton from "./_components/color-button";
import FontSizeButton from "./_components/font-size-button";
import HeadingButton from "./_components/heading-button";
import ItalicButton from "./_components/italic-button";
import LinkButton from "./_components/link-button";
import StrikethroughButton from "./_components/strikethrough-button";
import TableButton from "./_components/table-button";
import TextAlignButton from "./_components/text-align-button";
import UnderlineButton from "./_components/underline-button";
import UploadButton from "./_components/upload-button";
import { FontSize } from "./_extensions/font-size";
import { MyImage } from "./_extensions/image";

export enum TiptapEditorExtension {
  "heading" = "heading",
  "bold" = "bold",
  "underline" = "underline",
  "italic" = "italic",
  "text-align" = "text-align",
  "strikethrough" = "strikethrough",
  "upload" = "upload",
  "color" = "color",
  "table" = "table",
  "font-size" = "font-size",
  "link" = "link",
}

interface Props {
  extensions: TiptapEditorExtension[];
  content: string;
  onChangeContent: (value: string) => void;
  minHeight?: number;
  maxHeight?: number;
  editable?: boolean;
  onUpload?: (file: File, cb: (url: string) => void) => void;
  isFixedFontSizeInEditor?: boolean;
}

export default function TiptapEditor({
  extensions,
  content,
  onChangeContent,
  minHeight,
  maxHeight = 600,
  editable = true,
  onUpload,
  isFixedFontSizeInEditor = false,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ paragraph: false }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "gsap-text",
        },
      }),
      Underline,
      Italic,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Color,
      TextStyle,
      Dropcursor,
      MyImage.configure({ inline: true }),
      FontSize,
      Table.configure({
        HTMLAttributes: {
          style:
            "border-collapse: collapse; margin: 0px; overflow: hidden; table-layout: fixed; width: 100%;",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style:
            "border: 1px solid rgb(209 213 219); box-sizing: border-box; min-width: 1rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; position: relative; vertical-align: top; background-color: rgb(243 244 246); font-weight: 700; text-aligh: left;",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style:
            "border: 1px solid rgb(209 213 219); box-sizing: border-box; min-width: 1rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; position: relative; vertical-align: top;",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-700",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content,
    editable,
    onUpdate: (value) => {
      let html = value.editor.getHTML();
      html = html.replace(/<p([^>]*)>\s*<\/p>/g, "<p$1><br></p>");
      html = html.replace(/  /g, "&nbsp;&nbsp;");
      onChangeContent(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          "outline-0",
          minHeight ? `min-h-[${minHeight}px]` : "min-h-[200px]"
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;

    if (!content) {
      editor.commands.clearContent();
    }
  }, [editor, editable, content]);

  const handleImageButtonClick = () => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && onUpload) {
        onUpload(file, (url) =>
          editor.chain().focus().setImage({ src: url }).run()
        );
      }

      input.remove();
    };

    input.click();
  };

  if (!editor) return;

  return (
    <div className="flex w-full flex-col rounded-lg border bg-white">
      {isFixedFontSizeInEditor && (
        <style jsx global>{`
          .ProseMirror span {
            font-size: 0.875rem !important;
            line-height: inherit !important;
          }
        `}</style>
      )}

      <div
        className={cn(
          "m-0 flex flex-1 flex-wrap gap-1 align-middle text-[#666]",
          extensions.length > 0 && "p-1"
        )}
      >
        {extensions.map((item, index) => {
          if (item === TiptapEditorExtension.heading) {
            return (
              <HeadingButton key={index} editor={editor} disabled={!editable} />
            );
          }

          if (item === TiptapEditorExtension.bold) {
            return (
              <BoldButton key={index} editor={editor} disabled={!editable} />
            );
          }

          if (item === TiptapEditorExtension.underline) {
            return (
              <UnderlineButton
                key={index}
                editor={editor}
                disabled={!editable}
              />
            );
          }

          if (item === TiptapEditorExtension.italic) {
            return (
              <ItalicButton key={index} editor={editor} disabled={!editable} />
            );
          }

          if (item === TiptapEditorExtension.strikethrough) {
            return (
              <StrikethroughButton
                key={index}
                editor={editor}
                disabled={!editable}
              />
            );
          }

          if (item === TiptapEditorExtension["text-align"]) {
            return (
              <TextAlignButton
                key={index}
                editor={editor}
                disabled={!editable}
              />
            );
          }

          if (item === TiptapEditorExtension.upload) {
            return (
              <UploadButton
                key={index}
                editor={editor}
                onClick={handleImageButtonClick}
                disabled={!editable}
              />
            );
          }

          if (item === TiptapEditorExtension.color) {
            return (
              <ColorButton key={index} editor={editor} disabled={!editable} />
            );
          }

          if (item === TiptapEditorExtension.table) {
            return (
              <TableButton key={index} editor={editor} disabled={!editable} />
            );
          }

          if (item === TiptapEditorExtension["font-size"]) {
            return (
              <FontSizeButton
                key={index}
                editor={editor}
                disabled={!editable}
              />
            );
          }

          if (item === TiptapEditorExtension["link"]) {
            return (
              <LinkButton key={index} editor={editor} disabled={!editable} />
            );
          }
        })}
      </div>

      {extensions.length > 0 && <Separator />}

      <div
        className="overflow-auto p-4"
        style={{
          maxHeight,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
