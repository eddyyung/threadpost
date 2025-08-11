export default function ArticleCard({ article }: { article: any }) {
  return (
    <div className="p-4 bg-white/90 dark:bg-slate-900 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{article.title || article.post_id}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{article.excerpt || article.text}</p>
      <div className="flex justify-between mt-3 text-sm">
        <div>{article.author?.name || article.author_name}</div>
        <div>❤️ {article.like_count ?? ''}</div>
      </div>
    </div>
  )
}
