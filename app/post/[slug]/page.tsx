import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600 mb-6">文章不存在</p>
          <Link href="/" className="text-indigo-600 hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回首页
          </Link>
        </div>
      </nav>

      {/* 文章 */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
          </div>
        </header>

        <div 
          className="prose prose-lg prose-indigo max-w-none bg-white rounded-xl shadow-sm p-8 md:p-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
