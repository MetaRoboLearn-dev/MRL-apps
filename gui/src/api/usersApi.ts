export const getUsers = async () => {
  const res = await fetch("/api/users");
  return res.json();
}