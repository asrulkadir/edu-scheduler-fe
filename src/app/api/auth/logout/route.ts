export async function POST() {
  const backendUrl = `${process.env.URL_API}/api/auth/logout`;
  return await fetch(backendUrl, {
    method: 'POST',
  });
}
