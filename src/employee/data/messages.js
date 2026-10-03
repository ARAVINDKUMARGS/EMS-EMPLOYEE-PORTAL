const messages = {
  1: [
    {
      id: 1,
      type: "received",
      messageType: "text",
      text: "Hey Alex 👋",
      time: "09:15 AM",
    },
    {
      id: 2,
      type: "received",
      messageType: "text",
      text: "Can you review the authentication module before lunch?",
      time: "09:16 AM",
    },
    {
      id: 3,
      type: "sent",
      messageType: "text",
      text: "Sure! I'll check it in the next 30 minutes.",
      time: "09:20 AM",
      status: "read",
    },
    {
      id: 4,
      type: "received",
      messageType: "text",
      text: "Awesome. Thanks!",
      time: "09:21 AM",
    },
  ],

  2: [
    {
      id: 1,
      type: "received",
      messageType: "text",
      text: "Can we sync tomorrow?",
      time: "08:30 AM",
    },
    {
      id: 2,
      type: "sent",
      messageType: "text",
      text: "Sure. 10 AM works for me.",
      time: "08:35 AM",
      status: "delivered",
    },
  ],

  3: [
    {
      id: 1,
      type: "received",
      messageType: "text",
      text: "Your leave request has been approved.",
      time: "Yesterday",
    },
  ],

  4: [
    {
      id: 1,
      type: "received",
      messageType: "text",
      text: "Great work on the quarterly report!",
      time: "Monday",
    },
  ],

  5: [
    {
      id: 1,
      type: "received",
      messageType: "text",
      text: "Let's catch up after today's meeting.",
      time: "Monday",
    },
  ],

  6: [
    {
      id: 1,
      type: "received",
      messageType: "text",
      text: "I've pushed the latest backend code.",
      time: "Sunday",
    },
  ],
};

export default messages;