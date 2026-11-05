 
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
