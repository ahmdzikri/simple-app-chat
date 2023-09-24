import { redirect } from "next/navigation";
import { Chat } from "./_chat";
import { cookies } from "next/headers";

export default async function Page() {
  
  const getGuid = cookies().get("token")?.value ?? "";
  if(!getGuid)redirect("/");
  
  const values = getGuid.split("_");
  const cookieObj = {
    userName: values[0],
    token: values[1]
  }

  return <Chat cookies={cookieObj} />;
}
