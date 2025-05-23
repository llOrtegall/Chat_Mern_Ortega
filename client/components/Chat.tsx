'use client';

import { useState, useEffect } from "react";

export const ChatComponent = ({ email, names }: { email: string, names: string }) => {

  useEffect(() => {
    if(!email || !names) {
      console.error("Email or names are not provided");
      return;
    }

    const wsUrl = `ws://localhost:3010?email=${encodeURIComponent(email)}&name=${encodeURIComponent(names)}`;

    const socket = new WebSocket(wsUrl);  

    socket.addEventListener("open", () => {
      console.log("Connected to the server");
      socket.send(JSON.stringify({ email, names }));
    });

    socket.addEventListener("message", (event) => {
      console.log("Message from server: ", event.data);
    });

    socket.addEventListener("close", () => {
      console.log("Disconnected from the server");
    });

    return () => {
      socket.close();
    };
  }, [email, names]);

  return (

    <section className="px-4 flex-grow">
      <h2 className="text-lg font-bold">Users Connects</h2>
      <ul>
        <li>user 1</li>
        <li>user 2</li>
        <li>user 3</li>
      </ul>
    </section>
  )
}