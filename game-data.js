// game-data.js — All story scene data for Birmingham 1963
// Source of truth: birmingham storyline .md

const GAME_DATA = {

  // ─── INTRO CONTEXT SCENE ─────────────────────────────────────────────────
  context: {
    type: 'narrative',
    bg: 'round1-kelly-ingram-park',
    showHeader: true,
    title: null,
    paragraphs: [
      "It is May 2nd, 1963. Birmingham, Alabama.",
      "The Southern Christian Leadership Conference has organized what will become known as the Children's Crusade, a series of marches led not by adults, but by the city's own youth. Elementary schoolers, teenagers, college students. Some as young as six years old.",
      "Their plan: fill the city's jails. Overwhelm the system. Force Birmingham to negotiate.",
      "You are a Birmingham Police Officer. You have been on the force for eleven years. You have a family, a mortgage, a commanding officer you respect. You have never thought of yourself as a bad person.",
      "You believe in the chain of command. You believe that if everyone does their job, things stay safe. Your duty is to protect the city you love.",
      "Today, you have been assigned to the fire hose unit at Kelly Ingram Park.",
      "The march is coming."
    ],
    next: 'r1'
  },

  // ─── ROUND 1 ──────────────────────────────────────────────────────────────
  r1: {
    type: 'choice',
    bg: 'round1-kelly-ingram-park',
    showHeader: false,
    title: 'ROUND 1',
    setup: [
      "You stand, one of thirty officers. The march will be met at Kelly Ingram Park. Dispersal is the goal.",
      "You have been assigned to the fire hose unit.",
      "The officer next to you says quietly: \"I heard some of them are real young.\""
    ],
    choices: [
      {
        letter: 'A',
        label: "Don't question it.",
        reactionHeader: "A: Don't question it.",
        response: "You follow orders. That's your job. You've always done it and it's always been right.",
        next: 'r2'
      },
      {
        letter: 'B',
        label: "You whisper back to the officer next to you: \"So what's the protocol if children are in the march?\"",
        reactionHeader: "B: You whisper back to the officer next to you: \"So what's the protocol if children are in the march?\"",
        response: "OFFICER: \"Same thing, I guess.\"",
        next: 'r2'
      },
      {
        letter: 'C',
        label: "You blurt out loud: \"Are you telling us to use violence against children?\"",
        reactionHeader: "C: You blurt out loud: \"Are you telling us to use violence against children?\"",
        response: "COMMANDER: \"The protocol applies equally across all ages.\"\n\nEveryone nods.",
        next: 'r2'
      }
    ]
  },

  // ─── ROUND 2 ──────────────────────────────────────────────────────────────
  r2: {
    type: 'choice',
    bg: 'round2-fire-hose',
    showHeader: false,
    title: 'ROUND 2',
    setup: [
      "The first thing you notice is the singing, hundreds of the city's youth are fearlessly walking toward your line. The youngest ones are near the front. A girl, maybe eight, is looking directly at you.",
      "YOU: \"What do you want?\"",
      "Her gaze intense, she answers: \"Fee-dom.\" She can't even pronounce it, but she knows.",
      "A national news photographer is six feet away. Your face will be on tomorrow's paper.",
      "COMMANDER: \"Turn on the fire hoses!\"",
      "The pressure strips bark off trees. Children are knocked sideways."
    ],
    choices: [
      {
        letter: 'A',
        label: "You hold the line, reminding yourself that this is your patriotic duty. Protect your city.",
        reactionHeader: "A: You hold the line, reminding yourself that this is your patriotic duty.",
        response: "The hose kicks harder in your hands. You aim forward, but they don't back down.\n\nOFFICER: \"That's it! Keep it on them!\"\n\nThe girl is still there. She stumbles again but keeps moving.",
        next: 'r3_general'
      },
      {
        letter: 'B',
        label: "You adjust your aim away from the youngest, and toward the older teenagers.",
        reactionHeader: "B: You adjust your aim away from the youngest, and toward the older teenagers.",
        response: "The stream hits further back now. Older kids, stronger bodies.\n\nThe smallest ones directly in front of you take less of the force. The shift is not large enough for anyone else to notice. The girl is still standing.\n\nOFFICER: \"Keep it on the front!\"\n\nYou don't adjust back.",
        next: 'r3_general'
      },
      {
        letter: 'C',
        label: "You turn off your hose.",
        reactionHeader: "C: You turn off your hose.",
        response: "BEN is a few steps away, and his eyes find yours. He's your best friend in the same squad.\n\nHis hands gripping the hose are shaking, and his face is pale.\n\nHe screams over the roaring water: \"What, is it not working?!\"",
        next: 'strawberry_t'
      }
    ]
  },

  // ─── STRAWBERRY TRANSITION ───────────────────────────────────────────────
  strawberry_t: {
    type: 'narrative',
    bg: 'round2-fire-hose',
    showHeader: false,
    title: null,
    paragraphs: [
      "You drop the hose. It slams against the pavement, jerking wildly. The pressure is too high, the stream whips sideways, blasting into the line of officers.",
      "Panic washes over Ben's face. He looks back at the children, then the others, then back to you.",
      "BEN: \"What are you doing?\"",
      "You look at the photographer, then Ben. Shaking your head, you mutter: \"This isn't right. We shouldn't be doing this.\"",
      "Ben runs over and grabs you directly by the collar. His hose also abandoned now, the water blasts at them, everywhere, uncontrolled. You don't say anything else, but Ben can see through your eyes.",
      "The others stationed at this post start to notice the tension between you two. The freedom songs roar over the screaming and chaos. The hose bucks again, this time knocking an officer off balance. Another one stumbles trying to avoid the spray.",
      "A whistle blows, and an officer shouts: \"Kill the pressure! Kill it!\"",
      "Another yells: \"Shut it down! We're gonna hurt each other!\"",
      "COMMANDER: \"Control that hose dammit, HOLD THE LINE!\"",
      "Ben is still holding your collar.",
      "YOU: \"This isn't control.\"",
      "Ben looks around at the chaos. The children continue marching. The photographer moves closer, capturing the disorganization, the now conflicted and hesitant jumble of officers."
    ],
    next: 'r3_strawberry'
  },

  // ─── ROUND 3 — GENERAL PATH ───────────────────────────────────────────────
  r3_general: {
    type: 'choice',
    bg: 'round3-police-dogs',
    showHeader: false,
    title: 'ROUND 3',
    setup: [
      "Your commander is shouting, but the words are harder to make out over the chaos. Several police cruisers arrive…",
      "And the vicious police dogs enter the scene.",
      "COMMANDER: \"LOOK AT 'EM RUN! I want to see the dogs work!\"",
      "Amidst the new wave of terror, you notice a group of children stand their ground, arms linked.",
      "Some step forward, showing no fear. The GIRL is still there. An officer approaches her, the leashed dogs getting alarmingly close."
    ],
    choices: [
      {
        letter: 'A',
        label: "Look away. You don't know her, and this is the order your team was given.",
        reactionHeader: "A: Look away.",
        response: "The girl's voice cuts through the noise for a moment, then fades into it.\n\nThe dogs surge past you; no one stops them.",
        next: 'r4_general'
      },
      {
        letter: 'B',
        label: "You step in. You can at least protect this one child: \"She's too young, don't you think? Let her go.\"",
        reactionHeader: "B: You step in.",
        response: "The officer turns on you, irritated. \"Stay in line, and don't get in the way.\"\n\nHe hesitates for a split second, but tightens his grip on her. He drags her away.\n\nYour commander is watching now, you crossed a line, even if just barely.",
        next: 'r4_general'
      },
      {
        letter: 'C',
        label: "Step in between the officer and the GIRL.",
        reactionHeader: "C: You step in between the officer and the GIRL.",
        response: "He scowls at you: \"What do you think you're doing?\"\n\nHe swings at your face with his free arm, but you catch his wrist. You quickly glance over at the group of kids, then BEN. He's your best friend in the same squad.\n\nBen nods and immediately runs over to the children, shouting orders, directing them to scatter away.\n\nThe officer's dog lunges at you, and you barely roll out of its path.\n\nYou catch one last glimpse of the girl slipping away.",
        next: 'strawberry_r3c_t'
      }
    ]
  },

  // ─── ROUND 3 — STRAWBERRY PATH ────────────────────────────────────────────
  r3_strawberry: {
    type: 'choice',
    bg: 'round3-police-dogs',
    showHeader: false,
    title: 'ROUND 3',
    setup: [
      "The line is fractured now. Your commander is shouting, but the words are harder to make out over the chaos. Several police cruisers arrive…",
      "And the vicious police dogs enter the scene.",
      "COMMANDER: \"LOOK AT 'EM RUN! I want to see the dogs work!\"",
      "Amidst the new wave of terror, you notice a group of children stand their ground, arms linked.",
      "Some step forward, showing no fear. The GIRL is still there. An officer approaches her, the leashed dogs getting alarmingly close."
    ],
    choices: [
      {
        letter: 'A',
        label: "Look away. You don't know her, and this is the order your team was given.",
        reactionHeader: "A: Look away.",
        response: "The girl's voice cuts through the noise for a moment, then fades into it.\n\nThe dogs surge past you; no one stops them.",
        next: 'r4_general'
      },
      {
        letter: 'B',
        label: "You step in. You can at least protect this one child: \"She's too young, don't you think? Let her go.\"",
        reactionHeader: "B: You step in.",
        response: "The officer turns on you, irritated. \"Stay in line, and don't get in the way.\"\n\nHe hesitates for a split second, but tightens his grip on her. He drags her away.\n\nYour commander is watching now, you crossed a line, even if just barely.",
        next: 'r4_general'
      },
      {
        letter: 'C',
        label: "Step in between the officer and the GIRL.",
        reactionHeader: "C: You step in between the officer and the GIRL.",
        response: "He scowls at you: \"What do you think you're doing?\"\n\nHe swings at your face with his free arm, but you catch his wrist. You quickly glance over at the group of kids, then Ben.\n\nBen nods and immediately runs over to the children, shouting orders, directing them to scatter away.\n\nThe officer's dog lunges at you, and you barely roll out of its path.\n\nYou catch one last glimpse of the girl slipping away.",
        next: 'strawberry_r3c_t'
      }
    ]
  },

  // ─── STRAWBERRY R3C TRANSITION — DOG BITE ────────────────────────────────
  strawberry_r3c_t: {
    type: 'narrative',
    bg: 'round3-police-dogs',
    showHeader: false,
    title: null,
    paragraphs: [
      "The dog lunges again, but you don't move fast enough this time. Its jaws catch your forearm, and a sharp cry tears out of you before you realize. Pain surges, and your whole body freezes for a second too long.",
      "The dog's growl doesn't stop, its breath hot. Your other hand shoots forward, slamming against its shoulder, trying to keep its head away from your face.",
      "\"HEY, PULL IT BACK!\"",
      "The officer yanks hard, and the dog resists before releasing you.",
      "You stumble backward, clutching your arm. Blood seeps through your sleeve.",
      "Everything feels louder now.",
      "Ben is still working on moving the children.",
      "A hand grabs your shoulder.",
      "OFFICER: \"Pull yourself together and back in line.\""
    ],
    next: 'r4_strawberry'
  },

  // ─── ROUND 4 — GENERAL PATH ───────────────────────────────────────────────
  r4_general: {
    type: 'choice',
    bg: 'round4-mass-arrests',
    showHeader: false,
    title: 'ROUND 4',
    setup: [
      "A whistle pierces through the noise. The order changes.",
      "COMMANDER: \"MOVE IN. ARREST THEM.\"",
      "The line collapses into motion. Officers surge forward, grabbing children.",
      "COMMANDER: \"KEEP THEM MOVING, NO MORE DELAYS!\"",
      "Ahead, the school buses start filling fast.",
      "A group of children stand their ground. Some step forward. You see her again, the girl.",
      "You grab her, and she goes still, looking up at you. No fighting, no running, just waiting."
    ],
    choices: [
      {
        letter: 'A',
        label: "Look away. Focus on the arrest and bringing her to the bus.",
        reactionHeader: "A: Look away. Focus on the arrest and bringing her to the bus.",
        response: "You guide her forward, hand firm on her arm. She doesn't resist. The bus is already overcrowded. She squeezes inside, disappearing into the mass of bodies.\n\nCOMMANDER: \"Keep it moving!\"\n\nYou step back into line. One after another.\n\nIt gets easier. Or at least, that's what you tell yourself.",
        next: 'r5_general'
      },
      {
        letter: 'B',
        label: "Your eyes meet hers. You hesitate, and let go.",
        reactionHeader: "B: Your eyes meet hers. You hesitate, and let go.",
        response: "For a second, she's free.\n\nThen another officer grabs her. He snaps at you: \"What do you think you're doing?\"\n\n\"Nothing,\" you say, your throat tightening.\n\nHe pulls her away.\n\nYou're already turning back, already moving. Arrest after arrest… No more pauses now. It gets easier, at least that's what you tell yourself. You stop thinking about faces.",
        next: 'r5_general'
      },
      {
        letter: 'C',
        label: "You let her go.",
        reactionHeader: "C: You let her go.",
        response: "BEN stares at you: \"What are you doing?\"\n\nYou don't look away. \"We have to do something.\"\n\nThe noise keeps going around you, but you're no longer part of it.",
        next: 'watermelon_t'
      }
    ]
  },

  // ─── ROUND 4 — STRAWBERRY PATH (arm injury) ───────────────────────────────
  r4_strawberry: {
    type: 'choice',
    bg: 'round4-mass-arrests',
    showHeader: false,
    title: 'ROUND 4',
    setup: [
      "A whistle pierces through the noise. The order changes.",
      "COMMANDER: \"MOVE IN. ARREST THEM.\"",
      "The line collapses into motion. Officers surge forward, grabbing children. You're pushed forward with it, whether you're ready or not. Your arm burns with every movement.",
      "Ahead, the school buses start filling fast. You see her again. The girl.",
      "When you grab her, your injured arm falters. Your grip isn't as steady as it should be. She goes still, looking up at you. No fighting, no running, just waiting."
    ],
    choices: [
      {
        letter: 'A',
        label: "Push through the pain. Follow orders.",
        reactionHeader: "A: Push through the pain. Follow orders.",
        response: "You tighten your grip, ignoring the pain. \"Keep moving,\" you mutter, more to yourself than her.\n\nYou walk her to the bus. She doesn't resist. The bus is already overcrowded. She squeezes inside, disappearing into the mass of bodies.\n\nCOMMANDER: \"That's it. Keep it moving!\"\n\nYou step back, breathing hard. The pain fades into the background. Numbness is easier.",
        next: 'r5_general'
      },
      {
        letter: 'B',
        label: "Hesitate. Your grip loosens.",
        reactionHeader: "B: Hesitate. Your grip loosens.",
        response: "For a second, you don't move. Neither does she.\n\nThen another officer steps in, grabbing her roughly: \"What are you doing?\"\n\n\"Nothing,\" you say, your throat tightening.\n\nHe pulls her away. You stay where you are for a moment too long… then force yourself back into motion. Your arm hurts. Your head spins. You tell yourself it wasn't your choice.",
        next: 'r5_general'
      },
      {
        letter: 'C',
        label: "You let her go.",
        reactionHeader: "C: You let her go.",
        response: "This time, you don't pretend it was an accident. You stand there, your arm bleeding.\n\n\"This isn't right,\" you say out loud.\n\nBen turns to you: \"Don't…\"\n\nYou don't look away. \"We have to do something.\"",
        next: 'strawberry_r4c_t'
      }
    ]
  },

  // ─── WATERMELON TRANSITION — BUS RESCUE (from R4 general C) ──────────────
  watermelon_t: {
    type: 'narrative',
    bg: 'round4c-bus-rescue',
    showHeader: false,
    title: null,
    paragraphs: [
      "Your eyes frantically scan the chaos until they lock onto a school bus packed with children.",
      "You grab Ben: \"Ben. Look.\"",
      "He follows your gaze. His face tightens. \"That's crazy. We can't.\"",
      "YOU: \"Are you with me or not?\" A beat. His eyes are full of fear, of the possible consequences to come if he says yes.",
      "You don't wait. You move towards the bus alone. An officer stands guard.",
      "You say, forcing steadiness into your voice: \"I'll take over. They need someone stronger than me, you go back.\"",
      "He studies you, unconvinced.",
      "From behind: \"Hurry, come!\" The officer hesitates, then runs toward the chaos.",
      "Ben steps up beside you: \"You really thought I'd let you do this alone?\"",
      "You climb onto the bus. There's too many.",
      "YOU: \"Everyone out now!\"",
      "The scared children look around, murmuring amongst themselves.",
      "\"Now! If you leave now, you won't get arrested!\" you shout.",
      "For a moment, nothing happens. Then a shift. A child near the front moves. Then another.",
      "A voice asks something you can't hear. Ben pushes forward: \"Go. Now!\"",
      "The first one climbs down, then more. Much more urgently now, some stumble, some help each other.",
      "YOU: \"Keep moving. Don't stop.\"",
      "For a moment, it seems to be okay. It's working.",
      "Then it's noticed.",
      "—",
      "A shout cuts through everything, \"HEY, STOP\"",
      "Heads turn. Too many, too fast. A kid freezes halfway off the bus.",
      "Ben shoves past you: \"GO! GO!\"",
      "You grab the nearest one, pulling them down. \"Run!\" Some do, some hesitate.",
      "They spill out, stumbling, scattering, disappearing into the chaos.",
      "Hands grab you. You're yanked off the bus, thrown down. Your shoulder hits the pavement.",
      "\"WHAT DO YOU THINK YOU'RE DOING?\"",
      "You don't answer, you can't. You're still watching the gap where they got through. Ben is dragged down beside you. He's breathing hard.",
      "\"Worth it?\"",
      "Boots surround you. A baton presses into your chest, holding you down.",
      "COMMANDER: \"Get them out of here.\"",
      "Your hands are forced behind your back."
    ],
    next: 'straw_water_r5'
  },

  // ─── STRAWBERRY R4C TRANSITION — BUS RESCUE WITH ARM ─────────────────────
  strawberry_r4c_t: {
    type: 'narrative',
    bg: 'round4c-bus-rescue',
    showHeader: false,
    title: null,
    paragraphs: [
      "Your eyes frantically scan the chaos until they lock onto a school bus packed with children.",
      "You grab Ben.",
      "\"Ben. Look.\" you say.",
      "He follows your gaze. His face tightens. \"That's crazy. We can't.\"",
      "YOU: \"Are you with me or not?\"",
      "A beat. His eyes are full of fear, of the possible consequences to come if he says yes.",
      "You don't wait. You move towards the bus alone. An officer stands guard.",
      "You say, forcing steadiness into your voice: \"I'll take over. They need someone stronger than me, you go back.\" He studies you, unconvinced. You raise your injured arm, and he grimaces at the sight.",
      "From behind: \"Hurry, come!\"",
      "The officer hesitates, then runs toward the chaos.",
      "Ben steps up beside you: \"You really thought I'd let you do this alone?\"",
      "You climb onto the bus. There's too many.",
      "YOU: \"Everyone out now!\"",
      "The children look around, unsure.",
      "\"Now! If you leave now, you won't get arrested!\" you shout.",
      "For a moment, nothing happens. Then a shift. A child near the front moves. Then another.",
      "Ben pushes forward: \"Go. Now!\" The first one climbs down, then more.",
      "Much more urgently now, some stumble, some help each other.",
      "YOU: \"Keep moving. Don't stop.\"",
      "For a moment, it seems to be okay. It's working.",
      "Then it's noticed.",
      "—",
      "A shout cuts through everything, \"HEY, STOP\"",
      "Heads turn. Too many, too fast. A kid freezes halfway off the bus.",
      "Ben shoves past you: \"GO! GO!\"",
      "You grab the nearest one, pulling them down. \"Run!\" Some do, some hesitate.",
      "They spill out, stumbling, scattering, disappearing into the chaos.",
      "Hands grab you. You're yanked off the bus, thrown down. Your shoulder hits the pavement.",
      "\"WHAT DO YOU THINK YOU'RE DOING?\"",
      "You don't answer, you can't. You're still watching the gap where they got through. Ben is dragged down beside you. He's breathing hard.",
      "\"Worth it?\"",
      "Boots surround you. A baton presses into your chest, holding you down.",
      "COMMANDER: \"Get them out of here.\"",
      "Your hands are forced behind your back."
    ],
    next: 'straw_water_r5'
  },

  // ─── ROUND 5 — GENERAL PATH (home / TV) ─────────────────────────────────
  r5_general: {
    type: 'choice',
    bg: 'round5-home',
    showHeader: false,
    title: 'ROUND 5',
    setup: [
      "You finish the day. Your department has taken over 600 students to different jails, detention facilities, and local fairgrounds. The city's jails are filled to capacity, but the marches aren't stopping.",
      "When you get home, the lights are dim. The TV flickers across the walls.",
      "You hear it before you see it; water hitting pavement, dogs barking, shouting… singing.",
      "You step into the room. Your kids sit on the floor, close to the screen.",
      "The footage loops.",
      "Children thrown back by hoses. Dogs lunging. Officers holding the line. You.",
      "Your youngest looks up: \"Dad? That's you.\"",
      "You nod.",
      "\"Why are you hurting them?\" The question hangs. Orders… Duty… The law. None of it sounds right.",
      "\"Are they bad?\" Your older son asks.",
      "They're children, you think, the only thing \"wrong\" is their skin."
    ],
    choices: [
      {
        letter: 'A',
        label: "Justify it.",
        reactionHeader: "A: Justify it.",
        response: "\"They shouldn't have been out there,\" you respond.\n\nYou keep going, \"They knew what would happen.\" The footage keeps playing.\n\nYou continue, \"You can't just break the rules and expect nothing to happen.\"\n\nYour oldest frowns, \"But… they weren't doing anything.\"\n\nYou just shake your head. \"That's not how this works.\"",
        next: 'end_general'
      },
      {
        letter: 'B',
        label: "Acknowledge it, softly. \"No,\" you say quietly.",
        reactionHeader: "B: Acknowledge it, softly.",
        response: "You exhale. \"No… they're not bad.\" The words feel heavier than they should.\n\n\"They're kids,\" you say.\n\nYou hesitate. \"What happened… it wasn't right.\"\n\nThe room is quiet. The screen keeps playing.",
        next: 'end_general'
      },
      {
        letter: 'C',
        label: "Take responsibility.",
        reactionHeader: "C: Take responsibility.",
        response: "You say, your voice breaking: \"No. They're not bad.\"\n\n\"I am…\" you say.\n\nYou look at the screen, but immediately look away.\n\n\"They're just kids… And I hurt them,\" you say.\n\nSilence fills the room.\n\n\"That's on me,\" you say.",
        next: 'end_general'
      }
    ]
  },

  // ─── ROUND 5 — STRAW/WATER PATH (station / incident form) ────────────────
  straw_water_r5: {
    type: 'choice',
    bg: 'round5-police-station',
    showHeader: false,
    title: 'ROUND 5',
    setup: [
      "They process you in a back room at the station. Your own colleagues handle your paperwork in silence.",
      "Ben is in the next room. You can hear him through the wall.",
      "The officer who processes you sets the form down in front of you, still quiet. No one makes eye contact.",
      "You look down. Name. Badge number. Incident description.",
      "You pick up the pen."
    ],
    choices: [
      {
        letter: 'A',
        label: "Keep it simple.",
        reactionHeader: "A: Keep it simple.",
        response: "You write, \"Equipment malfunction led to loss of control. Actions taken in an attempt to restore order.\"\n\nYou cap the pen and slide the form back. You look at the wall and let out a deep sigh.\n\nYou go home that night.\n\nYour kids are asleep, and your wife is sitting at the kitchen table. She's seen the news coverage.",
        next: 'end_general'
      },
      {
        letter: 'B',
        label: "You write the truth. All of it.",
        reactionHeader: "B: You write the truth. All of it.",
        response: "You describe what you saw, what you did, what you refused to do. You write Ben's name. You write the girl's name; you don't know it, so you write, \"a girl, approximately eight years old, wearing a yellow dress.\"\n\nYou write the number of children on the bus, and you write what you said to the guard.\n\nYou slide the form back. Your colleague reads it. He looks up at you. He reads it again.\n\nHIM: \"You understand what this does to your career?\"\n\nYOU: \"... Yes.\"\n\nHIM: \"None of those children are going to remember your name, you know.\"\n\nYOU: \"Yeah, I know.\"\n\nHe takes it out of the room. You wait for forty minutes. Your commander comes in and sets the form face-down on the table between you.\n\nCOMMANDER: \"Your badge.\" You set it down beside the form.\n\nYou walk out of the station. Ben is sitting on the front steps. His badge is gone too. He looks up at you.\n\nThe two of you laugh. So much that tears start to come out.\n\nBEN: \"So…\"\n\nYOU: \"Yeah.\"",
        next: 'end_testimony'
      },
      {
        letter: 'C',
        label: "You don't write anything.",
        reactionHeader: "C: You don't write anything.",
        response: "You set the pen down. You push the form back across the table. It's blank.\n\nThe officer waits, \"I can't submit a blank form.\"\n\nYOU: \"Then you fill it out.\"\n\nHe stares at you. You stare back.\n\nHe picks up the form and leaves. You sit alone in the room for a long time.\n\nWhen the door opens again, you expect to see your commander. Instead, it's a man you don't recognize; older, Black, in a suit. He doesn't sit down.\n\nHe sets a card on the table in front of you, \"I'm an attorney.\"\n\nATTORNEY: \"I've been called in by the movement's legal team. I understand you helped children exit a vehicle today. You were injured doing it, and then arrested by your own department.\"\n\nATTORNEY: \"That's a story people will want to hear. If you want to tell me.\"\n\nHe leaves the card on the table. He walks out.\n\nYou sit there. Your arm throbs. Ben is somewhere in this building. You pick up the card.",
        next: 'end_testimony'
      }
    ]
  },

  // ─── ENDING — GENERAL ────────────────────────────────────────────────────
  end_general: {
    type: 'ending',
    bg: 'round5-home',
    showHeader: false,
    title: 'THE END',
    paragraphs: [
      "You make it make sense, because you have to.",
      "—",
      "In the morning, you go back to work. You are reassigned to the desk, away from the demonstrations. Filing. Your commander tells you it's temporary. You both know it isn't.",
      "The marches continue. The settlement is reached. The Civil Rights Act passes 13 months later. You are at your desk the day it passes."
    ]
  },

  // ─── ENDING — TESTIMONY ──────────────────────────────────────────────────
  end_testimony: {
    type: 'ending',
    bg: 'round5-police-station',
    showHeader: false,
    title: 'THE END',
    paragraphs: [
      "The attorney takes your statement; the real one describing the briefing, the hoses, the girl, the bus, Ben, the dogs, all of it. He writes everything down. You sign the documents.",
      "Three weeks later, your testimony is part of a federal civil rights complaint against the Birmingham Police Department. Your name is on it. Ben testifies too.",
      "—",
      "When you get home, the lights are dim. The TV flickers across the walls.",
      "You hear it again; water hitting pavement, dogs barking, shouting… singing.",
      "You step into the room. Your kids sit on the floor, close to the screen.",
      "Children thrown back by hoses. Dogs lunging. Officers holding the line. Then a flash of you protecting the little girl, fighting off the dog. Ben directing the kids away.",
      "Your youngest daughter looks up: \"Dad? That's you.\"",
      "Exhausted, you let yourself fall to your knees. You wrap your arms around her, holding her tight.",
      "HER: \"Were you scared?\"",
      "\"Yup. The whole time,\" you say. Your oldest son walks over, curious.",
      "HIM: \"Then why did you do it?\"",
      "You think about the girl in the yellow dress. The hundreds of children singing, even through everything.",
      "YOU: \"Being scared isn't an excuse to not do anything… especially when it's hurting innocent people.\""
    ]
  }

};
