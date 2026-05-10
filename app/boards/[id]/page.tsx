export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: boardId } = await params

  return <div>Board Page with id {boardId}</div>
}
