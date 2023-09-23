import { Dashboard } from "./_components/dashboard";
import { cookies } from "next/headers";

export default async function Page() {
  // const ws = new WebSocket("ws://localhost:3000/cable/");
  // let guidValue = "";
  // const getGuid = cookies().get("guid")?.value;
  // if (typeof getGuid === "string") {
  //   guidValue = getGuid;
  // } else {
  //   guidValue = Math.random().toString(36).substring(2, 15);
  // }
  // ws.onopen = () => {
  //   console.log("Connect to websocket server");
  //   ws.send(
  //     JSON.stringify({
  //       command: "subscribe",
  //       identifier: JSON.stringify({
  //         id: guidValue,
  //         channel: "MessagesChannel",
  //       })
  //     })
  //   )
  // };
  // const getGuid = "User" + Math.random().toString(36).substring(2, 15);
  const getGuid = cookies().get("guid")?.value ?? "";
  //   cookies().set("guid", getGuid);

  return <Dashboard name={getGuid} />;
}
