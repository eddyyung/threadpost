export default function ArticleCard({ article }: { article: any }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">{article.title}</h3>
      <p className="text-sm text-gray-600">{article.excerpt}</p>
      <div className="flex justify-between mt-2 text-sm">
        <span>{article.author?.name}</span>
        <span>❤️ {article.like_count}</span>
      </div>
    </div>
  )
}
