"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

// ✅ Dynamically import the initialized editor with SSR disabled
const Editor = dynamic(() => import("./mdx.editor"), {
  ssr: false,
});

// ✅ Forward ref to allow parent component to access editor methods
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

// ✅ For better debugging and DevTools display
ForwardRefEditor.displayName = "ForwardRefEditor";
