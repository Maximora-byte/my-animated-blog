import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default async function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            我的博客
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              登录
            </Link>
          </div>
        </div>
      </nav>

      {/* 英雄区 */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">欢迎来到我的博客</h1>
          <p className="text-xl opacity-90 mb-8">分享技术、生活与思考</p>
          <Link 
            href="#posts" 
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            开始阅读
          </Link>
        </div>
      </header>

      {/* 文章列表 */}
      <main id="posts" className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">最新文章</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">还没有文章，创建第一篇博客吧！</p>
            <div className="text-sm text-gray-400">
              在 content/posts/ 目录下创建 .md 文件
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link href={`/post/${post.slug}`}>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{post.author}</span>
                    <span>
                      {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                    </span>
                  </div>
                  <Link 
                    href={`/post/${post.slug}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    阅读更多 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>© 2026 我的博客. Built with Next.js ❤️</p>
        </div>
      </footer>
    </div>
  );
}
