
export async function sendMessage(body: string, name:string) {
    try {
        
        await fetch("http://localhost:3000/messages", {
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