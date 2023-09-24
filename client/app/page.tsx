import { Dashboard } from "./_components/dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

  const getGuid = cookies().get("token")?.value ?? "";
  if(getGuid)redirect("/chat");

  return <Dashboard />;
}
