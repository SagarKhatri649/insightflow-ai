// import { ForwardRefEditor } from "./forward-ref-editor";
// import { useFormState, useFormStatus } from "react-dom";
// import { updatePostActions } from "@/actions/edit-actions";
// import { Button } from "@mdxeditor/editor";
// import { useCallback, useState } from "react";
// import { Download } from "lucide-react";
// import { Edit2, Loader2, Download } from "lucide-react";



// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button
//       type="submit"
//       className={`w-40 bg-gradient-to-r form-purple-900 to-indigo-500 hover:from-purple-600 hover:to-indigo-600t text-white font-semibold py-2 px-4 rounded-full shadow-lg tranform  transition duration-200 ease-in-out hover:scale-150 focus:outline-none focus:ring-2`}
//       disabled={pending}
//     >
//       {pending ? (
//         <span className="flex items-center justify-center">
//           <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//           Updating.....
//         </span>
//       ) : (
//         <span className="flex items-center justify-center">

//           <Edit2 className="w-5 h-5 mr-2" />
//           Update TEXT
//         </span>
//       )}
//     </Button>
//   );
// }
// const initialState = {
//   success: false,
// };

// type UploadState = {
//   success: boolean;
// };

// type UploadAction = (
//   state: UploadState,
//   formData: FormData
// ) => Promise<UploadState>;


// export default function ContentEditor({
//   posts,
// }: {

//   posts: Array<{ content: string; title: string; id: string }>;
// }) {

//   const [content, setContent] = useState(posts[0].content);


//   const [isChanged, setIsChanged] = useState(false);

//   const updatePostActionWithId = updatePostActions.bind(null, {
//     postId: posts[0].id,
//     content,
//   });

//   const [state, formAction] = useFormState<UploadState, FormData>(
//   updatePostActionWithId as unknown as UploadAction,
//   initialState
// );

//   const handleContentChange = (value: string) => {
//     setContent(value);
//     setIsChanged(true);
//   };

//   const handleExport = useCallback(() => {

//     const filename = `${posts[0].title || "blog-post"}.md`;

//     const blob = new Blob([content], {
//       type:
//         "text/markdown charset= utf-8"
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     URL.revokeObjectURL(url);
//   }, [content, posts];

//   return (
//     <form action={formAction} className="flex flex-col gap-2">
//       <div className="flex justify-between items-center border-b-2 border-gray-200/50 pb-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
//             Edit Your post
//           </h2>
//           <p>
//             Start editing your post below....
//           </p>
//         </div>
//         <div className="flex gap-4">
//           <SubmitButton>
//           </SubmitButton>
//           <Button
//             onClick={handleExport}
//             className="w-40 bg-gradient-to-r from-amber-500 to-amber-900 hover:from-amber-600 hover:to-amber-100 tex-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focous:ring-amber-500
//         focus:ring-opcity-50"
//           >
//             <Download className="w-5 h-5 mr-2" />
//             Export
//           </Button>
//         </div>
//       </div>
//       <ForwardRefEditor
//         markdown={posts[0].content}
//         className="markdown-content border-dotted border-gray-200 border-2 p-4 rounded-md animate-in ease-in-out duration-75"

//         onChange={handleContentChange}>


//       </ForwardRefEditor>
//     </form>


//   );

// }

// 'use client';

// import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
// import { ForwardRefEditor } from './forward-ref-editor';
// import { Button } from '@/components/ui/button';
// import { Download, Edit2, Loader2 } from 'lucide-react';

// type Post = {
//   id: string;
//   title: string;
//   content: string;
// };

// export default function ContentEditor({ post }: { post: Post }) {
//   const [content, setContent] = useState(post.content);
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | null>(null);

//   // ─── MOUNT GUARD ────────────────────────────────────────────────────────────────
//   const isMounted = useRef(false);
//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // ─── HANDLERS ───────────────────────────────────────────────────────────────────
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     startTransition(async () => {
//       try {
//         const res = await fetch(`/api/posts/${post.id}`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ content }),
//         });
//         if (!res.ok) {
//           const { message } = await res.json();
//           throw new Error(message || `Status ${res.status}`);
//         }
//       } catch (err: any) {
//         console.error('Update failed:', err);
//         if (isMounted.current) setError(err.message);
//       }
//     });
//   };

//   const handleExport = useCallback(() => {
//     const filename = `${post.title || 'blog-post'}.md`;
//     const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     URL.revokeObjectURL(url);
//   }, [content, post.title]);

//   const handleContentChange = (val: string) => {
//     // Only update state if still mounted
//     if (isMounted.current) {
//       setContent(val);
//     }
//   };

//   // ─── RENDER ─────────────────────────────────────────────────────────────────────
//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//       <div className="flex justify-between items-center border-b-2 border-gray-200/50 pb-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
//             Edit Your Post
//           </h2>
//           <p>Start editing your post below...</p>
//           {error && <p className="text-red-500 mt-2">Error: {error}</p>}
//         </div>
//         <div className="flex gap-4">
//           <Button
//             type="submit"
//             disabled={isPending}
//             className="flex items-center gap-2 w-40 bg-gradient-to-r from-purple-900 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-full shadow-lg transition-transform duration-200 ease-in-out disabled:opacity-50"
//           >
//             {isPending ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" /> Updating...
//               </>
//             ) : (
//               <>
//                 <Edit2 className="w-5 h-5" /> Update Text
//               </>
//             )}
//           </Button>
//           <Button
//             type="button"
//             onClick={handleExport}
//             className="flex items-center gap-2 w-40 bg-gradient-to-r from-amber-500 to-amber-900 hover:from-amber-600 hover:to-amber-100 text-white font-semibold py-2 rounded-full shadow-lg transition-transform duration-200 ease-in-out"
//           >
//             <Download className="w-5 h-5" /> Export
//           </Button>
//         </div>
//       </div>

//       <ForwardRefEditor
//         markdown={content}
//         className="markdown-content border-dotted border-gray-200 border-2 p-4 rounded-md"
//         onChange={handleContentChange}
//       />
//     </form>
//   );
// }
////////////////////////////////////////////////////////////////////////////////////////
// components/ContentEditor.tsx
//////////////////////////////////////////////////
// components/ContentEditor.tsx

// components/ContentEditor.tsx
// components/ContentEditor.tsx
// components/ContentEditor.tsx
'use client';

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import { ForwardRefEditor } from './forward-ref-editor';
import { Button } from '@/components/ui/button';
import { Download, Edit2, Loader2 } from 'lucide-react';

type Post = { id: string; title: string; content: string };

export default function ContentEditor({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Mount guard
  const isMounted = useRef(false);
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

  // Save handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || `Status ${res.status}`);
        }
      } catch (err: any) {
        console.error('Update failed:', err);
        if (isMounted.current) setError(err.message);
      }
    });
  };

  // Export handler
  const handleExport = useCallback(() => {
    const filename = `${post.title || 'blog-post'}.md`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  }, [content, post.title]);

  // Content change
  const handleContentChange = (val: string) => { if (isMounted.current) setContent(val); };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6">
      {/* Card */}
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md p-6 rounded-2xl shadow-lg border border-border space-y-6">

        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Edit2 className="w-6 h-6 text-teal-400" /> Edit Your Post
            </h2>
            <p className="mt-1 text-gray-300">Start editing your post below...</p>
            {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none flex items-center gap-2 bg-gradient-to-r from-purple-900 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-transform duration-200 ease-in-out disabled:opacity-50"
            >
              {isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : <><Edit2 className="w-5 h-5" /> Update Text</>}
            </Button>
            <Button
              type="button"
              onClick={handleExport}
              className="flex-1 sm:flex-none flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-900 hover:from-amber-600 hover:to-amber-100 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-transform duration-200 ease-in-out"
            >
              <Download className="w-5 h-5" /> Export
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-700 bg-[rgba(255,255,255,0.02)] rounded-lg">
          <ForwardRefEditor
            markdown={content}
            onChange={handleContentChange}
            className="markdown-content prose prose-invert focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
