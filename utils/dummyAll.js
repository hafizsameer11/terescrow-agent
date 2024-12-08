import { icons, images } from "../constants";

export const DUMMY_ALL = [
  {
    id: "1",
    name: "Alex Saltzman",
    username: "@alex_saltzman",
    pfp: images.chatLogo,
    date: "10:00 AM",
    recentMessage: "Dave: I have attended to the user",
    seen: false,
    online: true,
    group: false
  },
  {
    id: "2",
    name: "Emma Johnson",
    username: "@emma_johnson",
    pfp: images.chatLogo2,
    date: "11:30 AM",
    recentMessage: "Emma: Sure, I'll get back to you shortly.",
    seen: true,
    online: false,
    group: false
  },
  {
    id: "3",
    name: "Michael Carter",
    username: "@michael_carter",
    pfp: images.chatLogo3,
    date: "Yesterday",
    recentMessage: "Michael: Can we reschedule the meeting?",
    seen: false,
    online: true,
    group: false
  },
  {
    id: "4",
    name: "Sophia Brown",
    username: "@sophia_brown",
    pfp: images.chatLogo,
    date: "2:45 PM",
    recentMessage: "Sophia: Thank you! That works for me.",
    seen: true,
    online: false,
    group: false
  },
  {
    id: "5",
    name: "Liam Davis",
    username: "@liam_davis",
    pfp: images.chatLogo3,
    date: "9:15 AM",
    recentMessage: "Liam: Let me check and get back to you.",
    seen: false,
    online: true,
    group: false
  },
  {
    id: "6",
    name: "Isabella Wilson",
    username: "@isabella_wilson",
    pfp: images.chatLogo2,
    date: "Last week",
    recentMessage: "Isabella: The presentation is ready for review.",
    seen: true,
    online: false,
    group: false
  },
  {
    id: "7",
    name: "William Taylor",
    username: "@william_taylor",
    pfp: images.chatLogo,
    date: "Today",
    recentMessage: "William: I'll join the call in 5 minutes.",
    seen: false,
    online: true,
    group: false
  },
  {
    id: "8",
    name: "Mia White",
    username: "@mia_white",
    pfp: images.chatLogo2,
    date: "3 days ago",
    recentMessage: "Mia: Have you received my email?",
    seen: true,
    online: false,
    group: false
  },
  {
    id: "9",
    name: "Noah Green",
    username: "@noah_green",
    pfp: images.chatLogo3,
    date: "Monday",
    recentMessage: "Noah: Please review the updated document.",
    seen: false,
    online: true,
    group: false
  },
  {
    id: "10",
    name: "Ava Lewis",
    username: "@ava_lewis",
    pfp: images.chatLogo,
    date: "4:20 PM",
    recentMessage: "Ava: That sounds like a plan!",
    seen: true,
    online: false,
    group: false
  },
  {
    id: "11",
    name: "Group 1",
    username: "@olivia_thompson",
    pfp: images.chatLogo3,
    date: "5:00 PM",
    recentMessage: "Olivia: I'm excited to see the results!",
    seen: true,
    online: false,
    group: true
  },
  {
    id: "12",
    name: "Group 2",
    username: "@olivia_thompson",
    pfp: images.chatLogo2,
    date: "6:00 PM",
    recentMessage: "Dave: I'm excited to see the results!",
    seen: true,
    online: true,
    group: true
  },
  {
    id: "13",
    name: "Group 3",
    username: "@olivia_thompson",
    pfp: images.chatLogo,
    date: "10:00 PM",
    recentMessage: "John: I'm excited to see the results!",
    seen: true,
    online: true,
    group: true
  },
  {
    id: "14",
    name: "Group 3",
    username: "@olivia_thompson",
    pfp: images.chatLogo,
    date: "10:00 PM",
    recentMessage: "John: I'm excited to see the results!",
    seen: true,
    online: true,
    group: true
  },
  {
    id: "15",
    name: "Group 3",
    username: "@olivia_thompson",
    pfp: images.chatLogo,
    date: "10:00 PM",
    recentMessage: "John: I'm excited to see the results!",
    seen: true,
    online: true,
    group: true
  },
  // DUMMY CHAT
  // {
  //   id: "16",
  //   pfp: images.mashGroup,
  //   name: "Alice Johnson",
  //   icon: icons.gallery,
  //   message: "I want to trade $100.00 Amazon...",
  //   timestamp: "1:00 PM",
  //   status: "Pending", // unanswered, pending, completed, declined
  //   seen: false,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "17",
  //   pfp: images.mashGroup,
  //   name: "Michael Smith",
  //   icon: icons.gallery,
  //   message: "Can I get more details about your services?",
  //   timestamp: "1:15 PM",
  //   status: "Unanswered",
  //   seen: false,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "18",
  //   pfp: images.mashGroup,
  //   name: "Emma Brown",
  //   icon: icons.gallery,
  //   message: "When will I receive my payment?",
  //   timestamp: "1:30 PM",
  //   status: "Completed",
  //   seen: true,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "19",
  //   pfp: images.mashGroup,
  //   name: "Liam Wilson",
  //   icon: icons.gallery,
  //   message: "Please call me back regarding the offer.",
  //   timestamp: "2:00 PM",
  //   status: "Declined",
  //   seen: false,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "20",
  //   pfp: images.mashGroup,
  //   name: "Sophia Davis",
  //   icon: icons.gallery,
  //   message: "I sent an email with my inquiry.",
  //   timestamp: "2:30 PM",
  //   status: "Pending",
  //   seen: true,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "21",
  //   pfp: images.mashGroup,
  //   name: "James Miller",
  //   icon: icons.gallery,
  //   message: "I want to trade $50.00 PayPal.",
  //   timestamp: "3:00 PM",
  //   status: "Pending",
  //   seen: false,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "22",
  //   pfp: images.mashGroup,
  //   name: "Isabella Martinez",
  //   icon: icons.gallery,
  //   message: "Thanks for completing my request!",
  //   timestamp: "3:30 PM",
  //   status: "Completed",
  //   seen: true,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "23",
  //   pfp: images.mashGroup,
  //   name: "William Anderson",
  //   icon: icons.gallery,
  //   message: "There seems to be an issue with my order.",
  //   timestamp: "4:00 PM",
  //   status: "Unanswered",
  //   seen: false,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "24",
  //   pfp: images.mashGroup,
  //   name: "Mia Thomas",
  //   icon: icons.gallery,
  //   message: "I want to trade $200.00 eBay...",
  //   timestamp: "4:30 PM",
  //   status: "Pending",
  //   seen: true,
  //   online: true,
  //   group: false,
  // },
  // {
  //   id: "25",
  //   pfp: images.mashGroup,
  //   name: "Benjamin Jackson",
  //   icon: icons.gallery,
  //   message: "Can you assist me with my request?",
  //   timestamp: "5:00 PM",
  //   status: "Unanswered",
  //   seen: false,
  //   online: true,
  //   group: false,
  // },
];