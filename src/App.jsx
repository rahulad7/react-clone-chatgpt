import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./index.css";

const configuration = new Configuration({
  organization: "org-Ddnw43Lfm9ZNRS3nmTfWbpUX",
  apiKey: "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",
});

delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();
    setIsTyping(true); // when its true it displays the "Typing"
    //keep track of this message before sending it
    let msgs = chats; //keeping tracks of the chats using messages
    msgs.push({ role: "user", content: message }); // pushing new messages
    setChats(msgs); //updating chats
    setMessage("");

    //calling endpoints
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "you are chatgpt.",
          },
          ...chats,
        ],
      })
      .then((result) => {
        msgs.push(result.data.choices[0].message);
        setChats(msgs); //updating chat history
        setIsTyping(false); //typing text disappers from our screen
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-300">
      <h1 className="text-2xl font-bold mb-4">React ChatGPT</h1>
      <div className="border rounded-lg p-4 max-w-md w-full mb-4 shadow-md">
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className="mb-2">
                <span
                  className={`${
                    chat.role === "user" ? "text-blue-500" : "text-green-500"
                  } font-bold`}
                >
                  {chat.role}
                </span>
                <span className="mx-1">:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
        {isTyping && (
          <p className="italic text-gray-500">
            <i>Typing...</i>
          </p>
        )}
      </div>
      <form onSubmit={(e) => chat(e, message)} className="w-10/12">
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message and press Enter"
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
}

export default App;
