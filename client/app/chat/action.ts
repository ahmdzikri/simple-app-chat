"use server"
export async function sendMessage(body: string, name:string) {
    try {
        
        await fetch("https://simple-chat-production-b153.up.railway.app/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name,body }),
          });
          
    } catch (error) {
      console.log(error)
    }
  }