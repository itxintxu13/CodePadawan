'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function ProtectedBlogPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    fetchPosts();
  }, [isSignedIn, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) throw new Error('Error al cargar los posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error('Error al crear el post');
      
      const data = await response.json();
      setPosts([...posts, data.post]);
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Crear Nuevo Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Título"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              placeholder="Contenido"
              className="w-full p-2 rounded bg-gray-700 text-white h-32"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Publicar
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>
            <p className="text-gray-300 mb-4">{post.content}</p>
            <div className="text-sm text-gray-400">
              <span>Por: {post.author}</span>
              <span className="ml-4">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}