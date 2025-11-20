export async function markAllReviewsSeen(): Promise<void> {
  const res = await fetch("/api/reviews/mark-seen", { method: "POST" });
  if (!res.ok) throw new Error("Failed to mark reviews as seen");
}

export async function getUnseenReviewsCount(): Promise<number> {
  const res = await fetch("/api/reviews/unseen-count");
  if (!res.ok) throw new Error("Failed to fetch unseen reviews count");
  const data = await res.json();
  return data.count;
}
