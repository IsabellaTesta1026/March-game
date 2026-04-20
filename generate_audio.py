#!/usr/bin/env python3
"""
Generate narration audio for Birmingham 1963 game via ElevenLabs.
Usage: ELEVEN_KEY='sk_...' python3 generate_audio.py
Skips files that already exist. Stops before exceeding the free quota.
"""
import os, sys, json, time, urllib.request, urllib.error

API_KEY  = os.environ.get('ELEVEN_KEY', '')
VOICE_ID = 'ErXwobaYiN019PkySvjV'   # Antoni — warm American male narrator
MODEL_ID = 'eleven_multilingual_v2'
OUT_DIR  = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio')
BUDGET   = 25000  # Starter plan budget
DELAY    = 0.7   # seconds between calls

if not API_KEY:
    sys.exit('ERROR: set ELEVEN_KEY env var.')

os.makedirs(OUT_DIR, exist_ok=True)

FILES = [
    # ── History screen (shown before character select) ────────────────────────
    ('history.mp3',
     "Birmingham, Alabama had earned a grim distinction. By the spring of 1963, it was widely regarded as the most thoroughly segregated city in America — a place where racial separation was enforced not only by law but by violence. Black residents were barred from white schools, restaurants, parks, and water fountains. Employment beyond manual labor was effectively closed off. The city's Black neighborhoods had been bombed so many times by white supremacists that one section had been nicknamed Dynamite Hill. "
     "At the center of the city's racial order stood T. Eugene Bull Connor, Birmingham's Commissioner of Public Safety. Connor had held the position on and off since 1937, and he wielded it without apology. He authorized police force against protesters, arrested civil rights organizers on a whim, and made no secret of his contempt for anyone who challenged the system. For years, his brutality had worked. "
     "But the city had its own resistance. Reverend Fred Shuttlesworth had been fighting Birmingham's segregation laws from within for nearly a decade. As founder of the Alabama Christian Movement for Human Rights, he survived a bomb blast on Christmas Day, 1956 — his home destroyed while he slept inside. He walked out of the rubble and told the crowd gathered outside that God had kept him alive for a reason. He kept organizing. "
     "In early 1963, Shuttlesworth invited Dr. Martin Luther King Jr. and the Southern Christian Leadership Conference to come to Birmingham. He believed the city's extremism would shock the nation. King accepted. That spring, they launched Project C — Project Confrontation — a campaign of nonviolent direct action: sit-ins, marches, and economic boycotts of segregated downtown businesses. King was arrested on Good Friday, April 12th. From his cell, he wrote the Letter from Birmingham Jail. "
     "Project C was struggling. Many Black adults were afraid to march, fearing arrest, job loss, or worse. Then James Bevel, the SCLC's Director of Direct Action, proposed something bold: recruit the children. They had less to lose. They were not afraid. Bevel had been meeting with students across the city — at churches, at schools — training them in nonviolent resistance, telling them they might be arrested. They said yes anyway. "
     "On the morning of May 2, 1963, over a thousand children and teenagers slipped out of their schools and made their way to 16th Street Baptist Church. They were singing. They marched out in waves toward downtown Birmingham. Bull Connor's officers were already in position. You are one of them."),

    # ── Context (every player) ────────────────────────────────────────────────
    ('scene-context-0.mp3', 'It is May 2nd, 1963. Birmingham, Alabama.'),
    ('scene-context-1.mp3', "The Southern Christian Leadership Conference has organized what will become known as the Children's Crusade \u2014 a series of marches led not by adults, but by the city's own youth. Elementary schoolers, teenagers, college students. Some as young as six years old."),
    ('scene-context-2.mp3', "Their plan: fill the city's jails. Overwhelm the system. Force Birmingham to negotiate."),
    ('scene-context-3.mp3', "You are a Birmingham Police Officer. You have been on the force for eleven years. You have a family, a mortgage, a commanding officer you respect. You have never thought of yourself as a bad person."),
    ('scene-context-4.mp3', "You believe in the chain of command. You believe that if everyone does their job, things stay safe. Your duty is to protect the city you love."),
    ('scene-context-5.mp3', "Today, you have been assigned to the fire hose unit at Kelly Ingram Park."),
    ('scene-context-6.mp3', "The march is coming."),

    # ── Round 1 setup beats ───────────────────────────────────────────────────
    ('scene-r1-0.mp3', "You stand, one of thirty officers. The march will be met at Kelly Ingram Park. Dispersal is the goal."),
    ('scene-r1-1.mp3', "You have been assigned to the fire hose unit."),
    ('scene-r1-2.mp3', 'The officer next to you says quietly: "I heard some of them are real young."'),

    # ── Round 2 setup beats ───────────────────────────────────────────────────
    ('scene-r2-0.mp3', "The first thing you notice is the singing, hundreds of the city's youth are fearlessly walking toward your line. The youngest ones are near the front. A girl, maybe eight, is looking directly at you."),
    ('scene-r2-1.mp3', 'YOU: "What do you want?"'),
    ('scene-r2-2.mp3', 'Her gaze intense, she answers: "Fee-dom." She can\'t even pronounce it, but she knows.'),
    ('scene-r2-3.mp3', "A national news photographer is six feet away. Your face will be on tomorrow's paper."),
    ('scene-r2-4.mp3', 'COMMANDER: "Turn on the fire hoses!"'),
    ('scene-r2-5.mp3', "The pressure strips bark off trees. Children are knocked sideways."),

    # ── Round 3 general setup beats ───────────────────────────────────────────
    ('scene-r3_general-0.mp3', "Your commander is shouting, but the words are harder to make out over the chaos. Several police cruisers arrive\u2026"),
    ('scene-r3_general-1.mp3', "And the vicious police dogs enter the scene."),
    ('scene-r3_general-2.mp3', 'COMMANDER: "LOOK AT \'EM RUN! I want to see the dogs work!"'),
    ('scene-r3_general-3.mp3', "Amidst the new wave of terror, you notice a group of children stand their ground, arms linked."),
    ('scene-r3_general-4.mp3', "Some step forward, showing no fear. The GIRL is still there. An officer approaches her, the leashed dogs getting alarmingly close."),

    # ── Round 3 strawberry setup beats ───────────────────────────────────────
    ('scene-r3_strawberry-0.mp3', "The line is fractured now. Your commander is shouting, but the words are harder to make out over the chaos. Several police cruisers arrive\u2026"),
    ('scene-r3_strawberry-1.mp3', "And the vicious police dogs enter the scene."),
    ('scene-r3_strawberry-2.mp3', 'COMMANDER: "LOOK AT \'EM RUN! I want to see the dogs work!"'),
    ('scene-r3_strawberry-3.mp3', "Amidst the new wave of terror, you notice a group of children stand their ground, arms linked."),
    ('scene-r3_strawberry-4.mp3', "Some step forward, showing no fear. The GIRL is still there. An officer approaches her, the leashed dogs getting alarmingly close."),

    # ── Round 4 general setup beats ───────────────────────────────────────────
    ('scene-r4_general-0.mp3', "A whistle pierces through the noise. The order changes."),
    ('scene-r4_general-1.mp3', 'COMMANDER: "MOVE IN. ARREST THEM."'),
    ('scene-r4_general-2.mp3', "The line collapses into motion. Officers surge forward, grabbing children."),
    ('scene-r4_general-3.mp3', 'COMMANDER: "KEEP THEM MOVING, NO MORE DELAYS!"'),
    ('scene-r4_general-4.mp3', "Ahead, the school buses start filling fast."),
    ('scene-r4_general-5.mp3', "A group of children stand their ground. Some step forward. You see her again, the girl."),
    ('scene-r4_general-6.mp3', "You grab her, and she goes still, looking up at you. No fighting, no running, just waiting."),

    # ── Round 4 strawberry setup beats ───────────────────────────────────────
    ('scene-r4_strawberry-0.mp3', "A whistle pierces through the noise. The order changes."),
    ('scene-r4_strawberry-1.mp3', 'COMMANDER: "MOVE IN. ARREST THEM."'),
    ('scene-r4_strawberry-2.mp3', "The line collapses into motion. Officers surge forward, grabbing children. You're pushed forward with it, whether you're ready or not. Your arm burns with every movement."),
    ('scene-r4_strawberry-3.mp3', "Ahead, the school buses start filling fast. You see her again. The girl."),
    ('scene-r4_strawberry-4.mp3', "When you grab her, your injured arm falters. Your grip isn't as steady as it should be. She goes still, looking up at you. No fighting, no running, just waiting."),

    # ── Round 5 general setup beats ───────────────────────────────────────────
    ('scene-r5_general-0.mp3', "You finish the day. Your department has taken over 600 students to different jails, detention facilities, and local fairgrounds. The city's jails are filled to capacity, but the marches aren't stopping."),
    ('scene-r5_general-1.mp3', "When you get home, the lights are dim. The TV flickers across the walls."),
    ('scene-r5_general-2.mp3', "You hear it before you see it; water hitting pavement, dogs barking, shouting\u2026 singing."),
    ('scene-r5_general-3.mp3', "You step into the room. Your kids sit on the floor, close to the screen."),
    ('scene-r5_general-4.mp3', "The footage loops."),
    ('scene-r5_general-5.mp3', "Children thrown back by hoses. Dogs lunging. Officers holding the line. You."),
    ('scene-r5_general-6.mp3', '"Dad?" Your youngest looks up, "That\'s you."'),
    ('scene-r5_general-7.mp3', "You nod."),
    ('scene-r5_general-8.mp3', '"Why are you hurting them?" The question hangs. Orders\u2026 Duty\u2026 The law. None of it sounds right.'),
    ('scene-r5_general-9.mp3', '"Are they bad?" Your older son asks.'),
    ('scene-r5_general-10.mp3', 'They\'re children, you think, the only thing "wrong" is their skin.'),

    # ── Straw/water R5 setup beats ─────────────────────────────────────────────
    ('scene-straw_water_r5-0.mp3', "They process you in a back room at the station. Your own colleagues handle your paperwork in silence."),
    ('scene-straw_water_r5-1.mp3', "Ben is in the next room. You can hear him through the wall."),
    ('scene-straw_water_r5-2.mp3', "The officer who processes you sets the form down in front of you, still quiet. No one makes eye contact."),
    ('scene-straw_water_r5-3.mp3', "You look down. Name. Badge number. Incident description."),
    ('scene-straw_water_r5-4.mp3', "You pick up the pen."),

    # ── Round 1 reactions ─────────────────────────────────────────────────────
    ('reaction-r1-a-0.mp3', "You follow orders. That's your job. You've always done it and it's always been right."),
    ('reaction-r1-b-0.mp3', 'OFFICER: "Same thing, I guess."'),
    ('reaction-r1-c-0.mp3', 'COMMANDER: "The protocol applies equally across all ages."'),
    ('reaction-r1-c-1.mp3', 'Everyone nods.'),

    # ── Round 2 reactions ─────────────────────────────────────────────────────
    ('reaction-r2-a-0.mp3', "The hose kicks harder in your hands. You aim forward, but they don't back down."),
    ('reaction-r2-a-1.mp3', 'OFFICER: "That\'s it! Keep it on them!"'),
    ('reaction-r2-a-2.mp3', "The girl is still there. She stumbles again but keeps moving."),
    ('reaction-r2-b-0.mp3', "The stream hits further back now. Older kids, stronger bodies."),
    ('reaction-r2-b-1.mp3', "The smallest ones directly in front of you take less of the force. The shift is not large enough for anyone else to notice. The girl is still standing."),
    ('reaction-r2-b-2.mp3', 'OFFICER: "Keep it on the front!"'),
    ('reaction-r2-b-3.mp3', "You don't adjust back."),
    ('reaction-r2-c-0.mp3', "BEN is a few steps away, and his eyes find yours. He's your best friend in the same squad."),
    ('reaction-r2-c-1.mp3', "His hands gripping the hose are shaking, and his face is pale."),
    ('reaction-r2-c-2.mp3', 'He screams over the roaring water: "What, is it not working?!"'),

    # ── Round 3 general reactions ─────────────────────────────────────────────
    ('reaction-r3_general-a-0.mp3', "The girl's voice cuts through the noise for a moment, then fades into it."),
    ('reaction-r3_general-a-1.mp3', "The dogs surge past you; no one stops them."),
    ('reaction-r3_general-b-0.mp3', 'The officer turns on you, irritated. "Stay in line, and don\'t get in the way."'),
    ('reaction-r3_general-b-1.mp3', "He hesitates for a split second, but tightens his grip on her. He drags her away."),
    ('reaction-r3_general-b-2.mp3', "Your commander is watching now \u2014 you crossed a line \u2014 even if just barely."),
    ('reaction-r3_general-c-0.mp3', 'He scowls at you: "What do you think you\'re doing?"'),
    ('reaction-r3_general-c-1.mp3', "He swings at your face with his free arm, but you catch his wrist. You quickly glance over at the group of kids, then BEN. He's your best friend in the same squad."),
    ('reaction-r3_general-c-2.mp3', "Ben nods and immediately runs over to the children, shouting orders, directing them to scatter away."),
    ('reaction-r3_general-c-3.mp3', "The officer's dog lunges at you, and you barely roll out of its path."),
    ('reaction-r3_general-c-4.mp3', "You catch one last glimpse of the girl slipping away."),

    # ── Round 4 general reactions ─────────────────────────────────────────────
    ('reaction-r4_general-a-0.mp3', "You guide her forward, hand firm on her arm. She doesn't resist. The bus is already overcrowded. She squeezes inside, disappearing into the mass of bodies."),
    ('reaction-r4_general-a-1.mp3', 'COMMANDER: "Keep it moving!"'),
    ('reaction-r4_general-a-2.mp3', "You step back into line. One after another."),
    ('reaction-r4_general-a-3.mp3', "It gets easier. Or at least, that's what you tell yourself."),
    ('reaction-r4_general-b-0.mp3', "For a second, she's free."),
    ('reaction-r4_general-b-1.mp3', 'Then another officer grabs her. He snaps at you: "What do you think you\'re doing?"'),
    ('reaction-r4_general-b-2.mp3', 'Your throat tightens. "Nothing."'),
    ('reaction-r4_general-b-3.mp3', "He pulls her away."),
    ('reaction-r4_general-b-4.mp3', "You're already turning back, already moving. Arrest after arrest\u2026 No more pauses now. It gets easier, at least that's what you tell yourself. You stop thinking about faces."),
    ('reaction-r4_general-c-0.mp3', 'BEN stares at you: "What are you doing?"'),
    ('reaction-r4_general-c-1.mp3', 'You don\'t look away. "We have to do something."'),
    ('reaction-r4_general-c-2.mp3', "The noise keeps going around you, but you're no longer part of it."),

    # ── Round 5 general reactions ─────────────────────────────────────────────
    ('reaction-r5_general-a-0.mp3', '"They shouldn\'t have been out there," you respond.'),
    ('reaction-r5_general-a-1.mp3', 'You keep going, "They knew what would happen." The footage keeps playing.'),
    ('reaction-r5_general-a-2.mp3', '"You can\'t just break the rules and expect nothing to happen."'),
    ('reaction-r5_general-a-3.mp3', 'Your oldest frowns, "But\u2026 they weren\'t doing anything."'),
    ('reaction-r5_general-a-4.mp3', 'You just shake your head. "That\'s not how this works."'),
    ('reaction-r5_general-b-0.mp3', 'You exhale. "No\u2026 they\'re not bad." The words feel heavier than they should.'),
    ('reaction-r5_general-b-1.mp3', '"They\'re kids."'),
    ('reaction-r5_general-b-2.mp3', 'You hesitate. "What happened\u2026 it wasn\'t right."'),
    ('reaction-r5_general-b-3.mp3', "The room is quiet. The screen keeps playing."),
    ('reaction-r5_general-c-0.mp3', '"No," your voice breaks, "They\'re not bad."'),
    ('reaction-r5_general-c-1.mp3', '"I am\u2026"'),
    ('reaction-r5_general-c-2.mp3', "You look at the screen, but immediately look away."),
    ('reaction-r5_general-c-3.mp3', '"They\'re just kids\u2026 And I hurt them."'),
    ('reaction-r5_general-c-4.mp3', "Silence fills the room."),
    ('reaction-r5_general-c-5.mp3', '"That\'s on me."'),

    # ── End general ───────────────────────────────────────────────────────────
    ('scene-end_general-0.mp3', "You make it make sense, because you have to."),
    ('scene-end_general-1.mp3', "In the morning, you go back to work. You are reassigned to the desk, away from the demonstrations. Filing. Your commander tells you it's temporary. You both know it isn't."),
    ('scene-end_general-2.mp3', "The marches continue. The settlement is reached. The Civil Rights Act passes 13 months later. You are at your desk the day it passes."),

    # ── Strawberry transition (hose drop) ─────────────────────────────────────
    ('scene-strawberry_t-0.mp3',  "You drop the hose. It slams against the pavement, jerking wildly. The pressure is too high \u2014 the stream whips sideways, blasting into the line of officers."),
    ('scene-strawberry_t-1.mp3',  "Panic washes over Ben's face. He looks back at the children, then the others, then back to you."),
    ('scene-strawberry_t-2.mp3',  'BEN: "What are you doing?"'),
    ('scene-strawberry_t-3.mp3',  'You look at the photographer, then Ben. Shaking your head, you mutter: "This isn\'t right. We shouldn\'t be doing this."'),
    ('scene-strawberry_t-4.mp3',  "Ben runs over and grabs you directly by the collar. His hose also abandoned now, the water blasts at them \u2014 everywhere \u2014 uncontrolled. You don't say anything else, but Ben can see through your eyes."),
    ('scene-strawberry_t-5.mp3',  "The others stationed at this post start to notice the tension between you two. The freedom songs roar over the screaming and chaos. The hose bucks again, this time knocking an officer off balance. Another one stumbles trying to avoid the spray."),
    ('scene-strawberry_t-6.mp3',  'A whistle blows, and an officer shouts: "Kill the pressure! Kill it!"'),
    ('scene-strawberry_t-7.mp3',  'Another yells: "Shut it down! We\'re gonna hurt each other!"'),
    ('scene-strawberry_t-8.mp3',  'COMMANDER: "Control that hose dammit, HOLD THE LINE!"'),
    ('scene-strawberry_t-9.mp3',  "Ben is still holding your collar."),
    ('scene-strawberry_t-10.mp3', 'YOU: "This isn\'t control."'),
    ('scene-strawberry_t-11.mp3', "Ben looks around at the chaos. The children continue marching. The photographer moves closer, capturing the disorganization, the now conflicted and hesitant jumble of officers."),

    # ── Dog bite transition ────────────────────────────────────────────────────
    ('scene-strawberry_r3c_t-0.mp3', "The dog lunges again, but you don't move fast enough this time. Its jaws catch your forearm, and a sharp cry tears out of you before you realize. Pain surges, and your whole body freezes for a second too long."),
    ('scene-strawberry_r3c_t-1.mp3', "The dog's growl doesn't stop, its breath hot. Your other hand shoots forward, slamming against its shoulder, trying to keep its head away from your face."),
    ('scene-strawberry_r3c_t-2.mp3', '"HEY \u2014 PULL IT BACK!"'),
    ('scene-strawberry_r3c_t-3.mp3', "The officer yanks hard, and the dog resists before releasing you."),
    ('scene-strawberry_r3c_t-4.mp3', "You stumble backward, clutching your arm. Blood seeps through your sleeve."),
    ('scene-strawberry_r3c_t-5.mp3', "Everything feels louder now."),
    ('scene-strawberry_r3c_t-6.mp3', "Ben is still working on moving the children."),
    ('scene-strawberry_r3c_t-7.mp3', "A hand grabs your shoulder."),
    ('scene-strawberry_r3c_t-8.mp3', 'OFFICER: "Pull yourself together and back in line."'),

    # ── R3 strawberry reactions ────────────────────────────────────────────────
    ('reaction-r3_strawberry-a-0.mp3', "The girl's voice cuts through the noise for a moment, then fades into it."),
    ('reaction-r3_strawberry-a-1.mp3', "The dogs surge past you; no one stops them."),
    ('reaction-r3_strawberry-b-0.mp3', 'The officer turns on you, irritated. "Stay in line, and don\'t get in the way."'),
    ('reaction-r3_strawberry-b-1.mp3', "He hesitates for a split second, but tightens his grip on her. He drags her away."),
    ('reaction-r3_strawberry-b-2.mp3', "Your commander is watching now \u2014 you crossed a line \u2014 even if just barely."),
    ('reaction-r3_strawberry-c-0.mp3', 'He scowls at you: "What do you think you\'re doing?"'),
    ('reaction-r3_strawberry-c-1.mp3', "He swings at your face with his free arm, but you catch his wrist. You quickly glance over at the group of kids, then Ben."),
    ('reaction-r3_strawberry-c-2.mp3', "Ben nods and immediately runs over to the children, shouting orders, directing them to scatter away."),
    ('reaction-r3_strawberry-c-3.mp3', "The officer's dog lunges at you, and you barely roll out of its path."),
    ('reaction-r3_strawberry-c-4.mp3', "You catch one last glimpse of the girl slipping away."),

    # ── R4 strawberry reactions ────────────────────────────────────────────────
    ('reaction-r4_strawberry-a-0.mp3', 'You tighten your grip, ignoring the pain. "Keep moving," you mutter, more to yourself than her.'),
    ('reaction-r4_strawberry-a-1.mp3', "You walk her to the bus. She doesn't resist. The bus is already overcrowded. She squeezes inside, disappearing into the mass of bodies."),
    ('reaction-r4_strawberry-a-2.mp3', 'COMMANDER: "That\'s it. Keep it moving!"'),
    ('reaction-r4_strawberry-a-3.mp3', "You step back, breathing hard. The pain fades into the background. Numbness is easier."),
    ('reaction-r4_strawberry-b-0.mp3', "For a second, you don't move. Neither does she."),
    ('reaction-r4_strawberry-b-1.mp3', 'Then another officer steps in, grabbing her roughly: "What are you doing?"'),
    ('reaction-r4_strawberry-b-2.mp3', 'Your throat tightens. "Nothing."'),
    ('reaction-r4_strawberry-b-3.mp3', "He pulls her away. You stay where you are for a moment too long\u2026 then force yourself back into motion. Your arm hurts. Your head spins. You tell yourself it wasn't your choice."),
    ('reaction-r4_strawberry-c-0.mp3', "This time, you don't pretend it was an accident. You stand there, your arm bleeding."),
    ('reaction-r4_strawberry-c-1.mp3', '"This isn\'t right," you say out loud.'),
    ('reaction-r4_strawberry-c-2.mp3', 'Ben turns to you: "Don\'t\u2026"'),
    ('reaction-r4_strawberry-c-3.mp3', 'You don\'t look away. "We have to do something."'),

    # ── End testimony — station ────────────────────────────────────────────────
    ('scene-end_testimony-0.mp3',  "The attorney takes your statement; the real one describing the briefing, the hoses, the girl, the bus, Ben, the dogs, all of it. He writes everything down. You sign the documents."),
    ('scene-end_testimony-1.mp3',  "Three weeks later, your testimony is part of a federal civil rights complaint against the Birmingham Police Department. Your name is on it. Ben testifies too."),

    # ── End testimony — home ──────────────────────────────────────────────────
    ('scene-end_testimony_home-0.mp3',  "When you get home, the lights are dim. The TV flickers across the walls."),
    ('scene-end_testimony_home-1.mp3',  "You hear it again; water hitting pavement, dogs barking, shouting\u2026 singing."),
    ('scene-end_testimony_home-2.mp3',  "You step into the room. Your kids sit on the floor, close to the screen."),
    ('scene-end_testimony_home-3.mp3',  "Children thrown back by hoses. Dogs lunging. Officers holding the line. Then a flash of you protecting the little girl, fighting off the dog. Ben directing the kids away."),
    ('scene-end_testimony_home-4.mp3',  '"Dad?" Your youngest daughter looks up, "That\'s you."'),
    ('scene-end_testimony_home-5.mp3',  "Exhausted, you let yourself fall to your knees. You wrap your arms around her, holding her tight."),
    ('scene-end_testimony_home-6.mp3',  'HER: "Were you scared?"'),
    ('scene-end_testimony_home-7.mp3',  'YOU: "Yup. The whole time." Your oldest son walks over, curious.'),
    ('scene-end_testimony_home-8.mp3',  'HIM: "Then why did you do it?"'),
    ('scene-end_testimony_home-9.mp3',  "You think about the girl in the yellow dress. The hundreds of children singing, even through everything."),
    ('scene-end_testimony_home-10.mp3', 'YOU: "Being scared isn\'t an excuse to not do anything\u2026 especially when it\'s hurting innocent people."'),

    # ── Straw/water R5 reactions ──────────────────────────────────────────────
    ('reaction-straw_water_r5-a-0.mp3', 'You write, "Equipment malfunction led to loss of control. Actions taken in an attempt to restore order."'),
    ('reaction-straw_water_r5-a-1.mp3', "You cap the pen and slide the form back. You look at the wall and let out a deep sigh."),
    ('reaction-straw_water_r5-a-2.mp3', "You go home that night."),
    ('reaction-straw_water_r5-a-3.mp3', "Your kids are asleep, and your wife is sitting at the kitchen table. She's seen the news coverage."),
    ('reaction-straw_water_r5-b-0.mp3', 'You describe what you saw, what you did, what you refused to do. You write Ben\'s name. You write the girl\'s name; you don\'t know it, so you write, "a girl, approximately eight years old, wearing a yellow dress."'),
    ('reaction-straw_water_r5-b-1.mp3', "You write the number of children on the bus, and you write what you said to the guard."),
    ('reaction-straw_water_r5-b-2.mp3', "You slide the form back. Your colleague reads it. He looks up at you. He reads it again."),
    ('reaction-straw_water_r5-b-3.mp3', 'HIM: "You understand what this does to your career?"'),
    ('reaction-straw_water_r5-b-4.mp3', 'YOU: "... Yes."'),
    ('reaction-straw_water_r5-b-5.mp3', 'HIM: "None of those children are going to remember your name, you know."'),
    ('reaction-straw_water_r5-b-6.mp3', 'YOU: "Yeah, I know."'),
    ('reaction-straw_water_r5-b-7.mp3', "He takes it out of the room. You wait for forty minutes. Your commander comes in and sets the form face-down on the table between you."),
    ('reaction-straw_water_r5-b-8.mp3', 'COMMANDER: "Your badge." You set it down beside the form.'),
    ('reaction-straw_water_r5-b-9.mp3', "You walk out of the station. Ben is sitting on the front steps. His badge is gone too. He looks up at you."),
    ('reaction-straw_water_r5-b-10.mp3', "The two of you laugh. So much that tears start to come out."),
    ('reaction-straw_water_r5-b-11.mp3', 'BEN: "So\u2026"'),
    ('reaction-straw_water_r5-b-12.mp3', 'YOU: "Yeah."'),
    ('reaction-straw_water_r5-c-0.mp3', "You set the pen down. You push the form back across the table. It's blank."),
    ('reaction-straw_water_r5-c-1.mp3', 'The officer waits, "I can\'t submit a blank form."'),
    ('reaction-straw_water_r5-c-2.mp3', 'YOU: "Then you fill it out."'),
    ('reaction-straw_water_r5-c-3.mp3', "He stares at you. You stare back."),
    ('reaction-straw_water_r5-c-4.mp3', "He picks up the form and leaves. You sit alone in the room for a long time."),
    ('reaction-straw_water_r5-c-5.mp3', "When the door opens again, you expect to see your commander. Instead, it's a man you don't recognize; older, Black, in a suit. He doesn't sit down."),
    ('reaction-straw_water_r5-c-6.mp3', 'He sets a card on the table in front of you, "I\'m an attorney."'),
    ('reaction-straw_water_r5-c-7.mp3', 'ATTORNEY: "I\'ve been called in by the movement\'s legal team. I understand you helped children exit a vehicle today. You were injured doing it, and then arrested by your own department."'),
    ('reaction-straw_water_r5-c-8.mp3', 'ATTORNEY: "That\'s a story people will want to hear. If you want to tell me."'),
    ('reaction-straw_water_r5-c-9.mp3', "He leaves the card on the table. He walks out."),
    ('reaction-straw_water_r5-c-10.mp3', "You sit there. Your arm throbs. Ben is somewhere in this building. You pick up the card."),

    # ── Watermelon transition — bus rescue (from R4 general C) ─────────────────
    ('scene-watermelon_t-0.mp3',  "Your eyes frantically scan the chaos until they lock onto a school bus packed with children."),
    ('scene-watermelon_t-1.mp3',  'You grab Ben: "Ben. Look."'),
    ('scene-watermelon_t-2.mp3',  'He follows your gaze. His face tightens. "That\'s crazy. We can\'t."'),
    ('scene-watermelon_t-3.mp3',  'YOU: "Are you with me or not?" A beat. His eyes are full of fear, of the possible consequences to come if he says yes.'),
    ('scene-watermelon_t-4.mp3',  "You don't wait. You move towards the bus alone. An officer stands guard."),
    ('scene-watermelon_t-5.mp3',  '"I\'ll take over," you say, forcing steadiness into your voice. "They need someone stronger than me \u2014 you go back."'),
    ('scene-watermelon_t-6.mp3',  "He studies you, unconvinced."),
    ('scene-watermelon_t-7.mp3',  'From behind: "Hurry, come!" The officer hesitates \u2014 then runs toward the chaos.'),
    ('scene-watermelon_t-8.mp3',  'Ben steps up beside you: "You really thought I\'d let you do this alone?"'),
    ('scene-watermelon_t-9.mp3',  "You climb onto the bus. There's too many."),
    ('scene-watermelon_t-10.mp3', 'YOU: "Everyone out now!"'),
    ('scene-watermelon_t-11.mp3', "The scared children look around, murmuring amongst themselves."),
    ('scene-watermelon_t-12.mp3', '"Now! If you leave now, you won\'t get arrested!"'),
    ('scene-watermelon_t-13.mp3', "For a moment, nothing happens. Then a shift. A child near the front moves. Then another."),
    ('scene-watermelon_t-14.mp3', 'A voice asks something you can\'t hear. Ben pushes forward: "Go. Now!"'),
    ('scene-watermelon_t-15.mp3', "The first one climbs down, then more. Much more urgently now, some stumble, some help each other."),
    ('scene-watermelon_t-16.mp3', 'YOU: "Keep moving. Don\'t stop."'),
    ('scene-watermelon_t-17.mp3', "For a moment, it seems to be okay. It's working."),
    ('scene-watermelon_t-18.mp3', "Then it's noticed."),
    ('scene-watermelon_t-19.mp3', 'A shout cuts through everything \u2014 "HEY \u2014 STOP"'),
    ('scene-watermelon_t-20.mp3', "Heads turn. Too many, too fast. A kid freezes halfway off the bus."),
    ('scene-watermelon_t-21.mp3', 'Ben shoves past you: "GO! GO!"'),
    ('scene-watermelon_t-22.mp3', 'You grab the nearest one, pulling them down. "Run!" Some do, some hesitate.'),
    ('scene-watermelon_t-23.mp3', "They spill out, stumbling, scattering, disappearing into the chaos."),
    ('scene-watermelon_t-24.mp3', "Hands grab you. You're yanked off the bus, thrown down. Your shoulder hits the pavement."),
    ('scene-watermelon_t-25.mp3', '"WHAT DO YOU THINK YOU\'RE DOING?"'),
    ('scene-watermelon_t-26.mp3', "You don't answer, you can't. You're still watching the gap where they got through. Ben is dragged down beside you. He's breathing hard."),
    ('scene-watermelon_t-27.mp3', '"Worth it?"'),
    ('scene-watermelon_t-28.mp3', "Boots surround you. A baton presses into your chest, holding you down."),
    ('scene-watermelon_t-29.mp3', 'COMMANDER: "Get them out of here."'),
    ('scene-watermelon_t-30.mp3', "Your hands are forced behind your back."),

    # ── Strawberry R4C transition — bus rescue with arm ────────────────────────
    ('scene-strawberry_r4c_t-0.mp3',  "Your eyes frantically scan the chaos until they lock onto a school bus packed with children."),
    ('scene-strawberry_r4c_t-1.mp3',  "You grab Ben."),
    ('scene-strawberry_r4c_t-2.mp3',  '"Ben. Look."'),
    ('scene-strawberry_r4c_t-3.mp3',  'He follows your gaze. His face tightens. "That\'s crazy. We can\'t."'),
    ('scene-strawberry_r4c_t-4.mp3',  'YOU: "Are you with me or not?"'),
    ('scene-strawberry_r4c_t-5.mp3',  "A beat. His eyes are full of fear, of the possible consequences to come if he says yes."),
    ('scene-strawberry_r4c_t-6.mp3',  "You don't wait. You move towards the bus alone. An officer stands guard."),
    ('scene-strawberry_r4c_t-7.mp3',  '"I\'ll take over," you say, forcing steadiness into your voice. "They need someone stronger than me \u2014 you go back." He studies you, unconvinced. You raise your injured arm, and he grimaces at the sight.'),
    ('scene-strawberry_r4c_t-8.mp3',  'From behind: "Hurry, come!"'),
    ('scene-strawberry_r4c_t-9.mp3',  "The officer hesitates \u2014 then runs toward the chaos."),
    ('scene-strawberry_r4c_t-10.mp3', 'Ben steps up beside you: "You really thought I\'d let you do this alone?"'),
    ('scene-strawberry_r4c_t-11.mp3', "You climb onto the bus. There's too many."),
    ('scene-strawberry_r4c_t-12.mp3', 'YOU: "Everyone out now!"'),
    ('scene-strawberry_r4c_t-13.mp3', "The children look around, unsure."),
    ('scene-strawberry_r4c_t-14.mp3', '"Now! If you leave now, you won\'t get arrested!"'),
    ('scene-strawberry_r4c_t-15.mp3', "For a moment, nothing happens. Then a shift. A child near the front moves. Then another."),
    ('scene-strawberry_r4c_t-16.mp3', 'Ben pushes forward: "Go. Now!" The first one climbs down, then more.'),
    ('scene-strawberry_r4c_t-17.mp3', "Much more urgently now, some stumble, some help each other."),
    ('scene-strawberry_r4c_t-18.mp3', 'YOU: "Keep moving. Don\'t stop."'),
    ('scene-strawberry_r4c_t-19.mp3', "For a moment, it seems to be okay. It's working."),
    ('scene-strawberry_r4c_t-20.mp3', "Then it's noticed."),
    ('scene-strawberry_r4c_t-21.mp3', 'A shout cuts through everything \u2014 "HEY \u2014 STOP"'),
    ('scene-strawberry_r4c_t-22.mp3', "Heads turn. Too many, too fast. A kid freezes halfway off the bus."),
    ('scene-strawberry_r4c_t-23.mp3', 'Ben shoves past you: "GO! GO!"'),
    ('scene-strawberry_r4c_t-24.mp3', 'You grab the nearest one, pulling them down. "Run!" Some do, some hesitate.'),
    ('scene-strawberry_r4c_t-25.mp3', "They spill out, stumbling, scattering, disappearing into the chaos."),
    ('scene-strawberry_r4c_t-26.mp3', "Hands grab you. You're yanked off the bus, thrown down. Your shoulder hits the pavement."),
    ('scene-strawberry_r4c_t-27.mp3', '"WHAT DO YOU THINK YOU\'RE DOING?"'),
    ('scene-strawberry_r4c_t-28.mp3', "You don't answer, you can't. You're still watching the gap where they got through. Ben is dragged down beside you. He's breathing hard."),
    ('scene-strawberry_r4c_t-29.mp3', '"Worth it?"'),
    ('scene-strawberry_r4c_t-30.mp3', "Boots surround you. A baton presses into your chest, holding you down."),
    ('scene-strawberry_r4c_t-31.mp3', 'COMMANDER: "Get them out of here."'),
    ('scene-strawberry_r4c_t-32.mp3', "Your hands are forced behind your back."),
]


def make_file(filename, text):
    filepath = os.path.join(OUT_DIR, filename)
    if os.path.exists(filepath):
        print(f'  skip  {filename}')
        return 0
    body = json.dumps({
        'text': text,
        'model_id': MODEL_ID,
        'voice_settings': {'stability': 0.45, 'similarity_boost': 0.75, 'style': 0.0},
    }).encode()
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}',
        data=body,
        headers={'xi-api-key': API_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'},
    )
    try:
        with urllib.request.urlopen(req) as r:
            with open(filepath, 'wb') as f:
                f.write(r.read())
        print(f'  ok    {filename}  ({len(text)} chars)')
        return len(text)
    except urllib.error.HTTPError as e:
        print(f'  ERROR {e.code} on {filename}: {e.read().decode(errors="replace")[:100]}')
        return 0


def main():
    total_chars = sum(len(t) for _, t in FILES)
    print(f'Files to generate: {len(FILES)}  |  Total chars: {total_chars:,}  |  Budget: {BUDGET:,}\n')

    spent = 0
    for filename, text in FILES:
        cost = len(text)
        if os.path.exists(os.path.join(OUT_DIR, filename)):
            print(f'  skip  {filename}')
            continue
        if spent + cost > BUDGET:
            print(f'\nBudget reached — stopping before {filename} ({cost} chars).')
            break
        spent += make_file(filename, text)
        time.sleep(DELAY)

    print(f'\nChars used this run: {spent:,}  |  Budget remaining: {BUDGET - spent:,}')

if __name__ == '__main__':
    main()
