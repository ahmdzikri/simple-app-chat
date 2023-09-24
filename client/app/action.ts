"use server";
import { cookies } from "next/headers";
export async function startChat(userName: string) {
  try {
    const result = await getDistinctUsernames();

    if (Array.isArray(result) && result.includes(userName)) {
      throw "Username already exists";
    } else if ("error" in result) {
      throw { msg: "", err: result.error };
    }

    const cookiesList = cookies();
    const hasCookie = cookiesList.get("token");
    if (!hasCookie) {
      const getToken = Math.random().toString(36).substring(2, 15);
      const combinedValue = `${userName}_${getToken}`;
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      cookies().set({
        name: "token",
        value: combinedValue,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        expires: expirationDate,
      });
    }
    return { msg: "Have fun !!!" };
  } catch (error) {
    return { msg: "", err: (error as Error).message ?? error };
  }
}
async function getDistinctUsernames(): Promise<string[] | { error: string }> {
  try {
    const response = await fetch(
      "https://simple-chat-production-b153.up.railway.app/messages",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw "Failed to fetch messages";
    }

    const messages = await response.json();

    if (!Array.isArray(messages)) {
      throw "Invalid JSON data received";
    }

    const uniqueUsernames: string[] = Array.from(
      new Set(messages.map((message: any) => message.name))
    );

    return uniqueUsernames;
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: (error as Error).message ?? (error as Error).toString() };
  }
}
