'use client';
export default function Error({ error }: { error: Error }) {
  return <div style={{ padding: 24 }}>Error: {error.message}</div>;
}
