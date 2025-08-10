import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function exportToExcel(filename: string, rows: any[]) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'HotArticles')
  XLSX.writeFile(wb, filename)
}

export function exportToPDF(filename: string, rows: any[]) {
  const doc = new jsPDF()
  ;(doc as any).autoTable({
    head: [['Title', 'Author', 'Likes', 'CreatedAt']],
    body: rows.map(r => [r.title, r.author || '', r.like_count, r.created_at])
  })
  doc.save(filename)
}
