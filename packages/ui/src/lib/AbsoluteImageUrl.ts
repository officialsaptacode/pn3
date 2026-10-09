export function AbsoluteImage(url: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}/file-upload/${encodeURIComponent(url)}`;
}
