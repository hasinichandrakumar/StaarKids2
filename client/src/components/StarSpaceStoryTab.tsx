import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Star, Users, MapPin, Zap, Trophy, Target, Book } from "lucide-react";

interface StarSpaceStoryTabProps {
  user: any;
  starPower: number;
}

const STORY_CHAPTERS = [
  {
    id: 1,
    title: "The Cosmic Distress Signal",
    unlockStars: 0,
    description: "A mysterious transmission leads you on the greatest adventure of your life!",
    story: "🚨 While stargazing on your roof, your telescope picks up an emergency transmission: 'MAYDAY! This is Captain Stardust of the Learning Galaxy! Our Knowledge Crystals are being drained by the evil Confusion Empire! We need a brave young mind to help save education across the cosmos!' Suddenly, a golden portal opens beneath your feet...",
    mission: "Solve 8 cosmic puzzles with 75% accuracy to reach the galaxy",
    reward: 200,
    planet: "Earth's Roof",
    unlocked: true
  },
  {
    id: 2,
    title: "Welcome to Starport Academy",
    unlockStars: 400,
    description: "You crash-land at the legendary academy where heroes are trained!",
    story: "🏫 Your ship crashes into the landing bay of Starport Academy with a BANG! Captain Stardust rushes over: 'Perfect timing! You're the new cadet we've been waiting for! But listen carefully - the evil Emperor Confusion has stolen our Power Gems and scattered them across 30 dangerous worlds. Only by mastering Math and Reading can we get them back and save the galaxy!'",
    mission: "Pass Academy entrance exam: 15 questions with 80% accuracy",
    reward: 250,
    planet: "Starport Academy",
    unlocked: false
  },
  {
    id: 3,
    title: "The Secret of the Golden Toolkit",
    unlockStars: 800,
    description: "Professor Quantum reveals the legendary toolkit that gives learners superpowers!",
    story: "🔧 Professor Quantum, a wild-haired scientist, bursts into the room carrying a glowing golden toolkit. 'This,' he announces, 'contains the Learning Superpowers! Math Vision, Reading Radar, Problem-Solving Strength, and Critical Thinking Speed! But first, you must prove you're worthy by mastering the basics!'",
    mission: "Demonstrate mastery: 20 questions with 85% accuracy to unlock the toolkit",
    reward: 300,
    planet: "Starport Academy",
    unlocked: false
  },
  {
    id: 4,
    title: "Journey to the Singing Crystals",
    unlockStars: 1200,
    description: "Your first real mission takes you to the musical Planet Harmonia!",
    story: "🎵 Captain Melody receives a distress call from Planet Harmonia: 'Help! The Confusion Clouds are making our singing crystals go silent! Without our crystal songs, students across the galaxy can't learn their multiplication tables!' You grab your new toolkit and blast off into space!",
    mission: "Navigate asteroid field: 25 questions in 15 minutes with 80% accuracy",
    reward: 350,
    planet: "Space - Asteroid Field",
    unlocked: false
  },
  {
    id: 5,
    title: "The Crystal Choir Rescue",
    unlockStars: 1600,
    description: "Save the musical crystals and restore their learning songs!",
    story: "💎 On Planet Harmonia, you discover thousands of beautiful crystals that have lost their voices! The Crystal Conductor, a majestic being made of pure music notes, explains: 'Each crystal must remember its unique song through mathematical harmony. Help us rebuild our choir!'",
    mission: "Restore crystal harmony: 30 questions with 88% accuracy to revive the songs",
    reward: 400,
    planet: "Planet Harmonia",
    unlocked: false
  },
  {
    id: 4,
    title: "The Crystal Singers of Lumina",
    unlockStars: 1800,
    description: "On Planet Lumina, you discover the crystal caves and meet their musical guardians!",
    story: "💎 You land on Planet Lumina and hear beautiful singing echoing from crystal caves. The Luminoids, beings made of pure crystal, greet you with musical tones. 'The Shadow Doubts silenced our knowledge songs,' they chime sadly. 'Help us remember the ancient melodies by solving the riddles written in the crystal walls!'",
    mission: "Master 5 different TEKS standards with 90% accuracy each to restore their songs",
    reward: 200,
    planet: "Planet Lumina",
    unlocked: false
  },
  {
    id: 5,
    title: "The Broken Star Map",
    unlockStars: 2500,
    description: "The ancient star map is damaged! Use your skills to piece together the cosmic puzzle.",
    story: "🗺️ Inside the crystal caves, you find the legendary Star Map, but it's shattered into pieces! Each correct answer helps reconstruct a piece of the map. The Luminoids gasp with excitement as sections begin to glow, revealing the path to the next clue about defeating the Shadow Doubts.",
    mission: "Achieve 90% accuracy on 50 consecutive questions to rebuild the map",
    reward: 300,
    planet: "Planet Lumina",
    unlocked: false
  },
  {
    id: 6,
    title: "The Space Whale's Warning",
    unlockStars: 3500,
    description: "Giant space whales appear with an urgent message about the Shadow Doubts!",
    story: "🐋 As you leave Lumina, enormous space whales surround your ship! Their leader, Elder Cosmos, speaks telepathically: 'Young hero, the Shadow Doubts grow stronger! They have captured our song-keeper, Melody. Only by mastering patterns can you free her and learn the secret of the Crystal of Learning's location.'",
    mission: "Complete 20 advanced pattern-based problems with perfect accuracy",
    reward: 350,
    planet: "Deep Space",
    unlocked: false
  },
  {
    id: 7,
    title: "Journey to the Time Rift",
    unlockStars: 4800,
    description: "The space whales guide you to a mysterious rift in time where past and future collide!",
    story: "⏰ Following the whales' directions, you discover a swirling time rift! Professor Chronos, guardian of time itself, emerges from the portal. 'The Shadow Doubts are trying to erase educational history!' he warns. 'Quick! We must gather knowledge from different time periods to strengthen our defenses!'",
    mission: "Complete 8 challenging historical reading passages with 95% comprehension",
    reward: 400,
    planet: "Time Rift Station",
    unlocked: false
  },
  {
    id: 8,
    title: "The Gravity Prison",
    unlockStars: 6200,
    description: "You discover that Melody the song-keeper is trapped in a gravity prison on Planet Bounce!",
    story: "🏃‍♂️ Professor Chronos reveals that Melody is imprisoned on Planet Bounce, where gravity itself has been weaponized by the Shadow Doubts! 'The only way to break the gravity locks,' he explains, 'is to solve geometric puzzles that control the planet's physics. Be careful - one wrong calculation and you'll float away forever!'",
    mission: "Solve 25 advanced geometry problems in under 30 minutes with 85% accuracy",
    reward: 500,
    planet: "Planet Bounce",
    unlocked: false
  },
  {
    id: 9,
    title: "Melody's Story Library",
    unlockStars: 8000,
    description: "Free Melody, who reveals the location of the legendary Story Library!",
    story: "📚 You successfully free Melody! Grateful, she sings a beautiful note that opens a portal to the hidden Story Library. 'In this magical place,' Melody explains, 'stories hold the power to defeat Shadow Doubts. But first, you must prove your mastery of reading comprehension. The books will test you, but if you succeed, they'll reveal the Crystal of Learning's secret!'",
    mission: "Achieve perfect scores on 10 complex reading comprehension passages",
    reward: 600,
    planet: "Story Library Dimension",
    unlocked: false
  },
  {
    id: 10,
    title: "The Shadow Doubts' Attack",
    unlockStars: 10500,
    description: "The Shadow Doubts discover your location and launch their first major attack!",
    story: "🌑 Dark clouds suddenly fill the library as the Shadow Doubts appear! Their leader, Lord Confusion, sneers: 'So, you're the one trying to restore confidence to young learners! Let's see how you handle my Number Vanishing Curse!' All the numbers in the library begin disappearing. You must solve complex problems quickly before all mathematical knowledge is lost forever!",
    mission: "Solve 30 multi-step word problems in 25 minutes with 90% accuracy",
    reward: 700,
    planet: "Story Library Under Attack",
    unlocked: false
  },
  {
    id: 11,
    title: "Alliance of the Cosmic Circus",
    unlockStars: 13000,
    description: "The legendary Cosmic Circus offers to help in your fight against the Shadow Doubts!",
    story: "🎪 After repelling the attack, Ringmaster Cosmos appears with his traveling circus! 'We've been hiding from the Shadow Doubts for years,' he explains. 'But your courage inspires us! Our performers know ancient mathematical secrets. Learn from our acrobats and you'll gain the skills needed to find the Crystal of Learning!'",
    mission: "Complete 100 mixed practice problems with 92% overall accuracy",
    reward: 800,
    planet: "Mobile Circus Ship",
    unlocked: false
  },
  {
    id: 12,
    title: "The Storm Clue",
    unlockStars: 16500,
    description: "Weather Wizard Nimbus holds a crucial clue hidden in the patterns of cosmic storms!",
    story: "⛈️ The circus leads you to Cloud City, where Weather Wizard Nimbus greets you urgently. 'The Shadow Doubts have been creating chaos storms to hide their movements!' she reveals. 'But I've discovered their pattern! Use data analysis to decode the storm sequences and reveal the location of their secret base!'",
    mission: "Master 15 advanced data analysis problems with perfect accuracy",
    reward: 900,
    planet: "Cloud City",
    unlocked: false
  },
  {
    id: 13,
    title: "The Pirate's Secret Chart",
    unlockStars: 20000,
    description: "Space pirates reveal they've been guarding a secret treasure map all along!",
    story: "🏴‍☠️ Following the storm clues, you reach Treasure Cove where Captain Starbones awaits. 'Arrr! We've been protecting this secret chart from the Shadow Doubts for centuries!' She unfolds an ancient map. 'It shows the coordinates of the Crystal of Learning's hiding place, but the coordinates are in a mathematical code only the worthy can solve!'",
    mission: "Solve 35 complex coordinate geometry problems in 40 minutes with 88% accuracy",
    reward: 1000,
    planet: "Treasure Cove",
    unlocked: false
  },
  {
    id: 14,
    title: "Building the Crystal Detector",
    unlockStars: 24000,
    description: "The galaxy's greatest inventors help you build a device to locate the Crystal of Learning!",
    story: "⚙️ At Innovation Hub, brilliant inventors have been working on a Crystal Detector! 'The device is almost complete,' explains Chief Engineer Bolt, 'but we need someone with exceptional mathematical skills to calibrate the final calculations. One mistake and the detector could lead us into a Shadow Doubt trap instead!'",
    mission: "Complete 50 engineering-based math challenges with 95% precision",
    reward: 1200,
    planet: "Innovation Hub",
    unlocked: false
  },
  {
    id: 15,
    title: "The Harmony of Knowledge",
    unlockStars: 28500,
    description: "Maestro Harmony reveals that music holds the key to awakening the Crystal of Learning!",
    story: "🎵 With the detector complete, Maestro Harmony appears with startling news! 'The Crystal of Learning doesn't just need to be found - it needs to be awakened with the perfect mathematical harmony!' She explains that combining musical patterns with mathematical precision creates the resonance frequency needed to restore the crystal's power.",
    mission: "Master 40 fraction and pattern problems with 98% accuracy in sequence",
    reward: 1400,
    planet: "Harmonia",
    unlocked: false
  },
  {
    id: 16,
    title: "The Final Test",
    unlockStars: 33000,
    description: "Lord Confusion challenges you to the ultimate battle of minds!",
    story: "🏆 Your detector leads you to the Shadow Doubts' fortress, where Lord Confusion awaits! 'Before you can claim the Crystal of Learning,' he snarls, 'you must prove your knowledge is stronger than my confusion!' He summons the greatest academic challenge you've ever faced - a test that combines everything you've learned.",
    mission: "Complete 3 full mock exams with 90% average accuracy to defeat Lord Confusion",
    reward: 1600,
    planet: "Shadow Fortress",
    unlocked: false
  },
  {
    id: 17,
    title: "The Crystal's Hidden Location",
    unlockStars: 38000,
    description: "Defeat Lord Confusion and discover where the Crystal of Learning is truly hidden!",
    story: "🗺️ As Lord Confusion fades away, defeated by your knowledge, he gasps: 'The Crystal... it was never hidden from you... it was hidden within you all along!' Suddenly, you understand - the Crystal of Learning grows stronger inside every student who masters their subjects. Your journey has been awakening your own inner crystal!",
    mission: "Solve 75 complex multi-step problems with 96% accuracy to fully awaken your inner crystal",
    reward: 1800,
    planet: "Within Yourself",
    unlocked: false
  },
  {
    id: 18,
    title: "The Heroes Return",
    unlockStars: 44000,
    description: "Return to StarSpace Academy as a true Knowledge Hero!",
    story: "🦸‍♀️ You return to StarSpace Academy, where all your friends celebrate your victory! Commander Nova smiles proudly: 'You've learned the greatest secret - that knowledge itself is the most powerful force in the universe!' Captain Calculate, Reading Ranger, and all the allies you've met cheer as you're inducted into the Knowledge Heroes Hall of Fame!",
    mission: "Achieve 97% accuracy across 200 advanced problems spanning all subjects",
    reward: 2000,
    planet: "StarSpace Academy",
    unlocked: false
  },
  {
    id: 19,
    title: "Guardian of the Galaxy",
    unlockStars: 51000,
    description: "The galaxy chooses you as its Guardian of Learning and Knowledge!",
    story: "💎 With the Shadow Doubts defeated, confidence returns to learners across the galaxy! The Council of Wise Planets unanimously chooses you as the Guardian of Learning. Elder Cosmos presents you with the Time Crystal Badge - a symbol that you'll help other students believe in themselves and never give up learning!",
    mission: "Achieve perfect mastery (95%+ accuracy) in ALL Grade 3-5 TEKS standards",
    reward: 2500,
    planet: "Council of Planets",
    unlocked: false
  },
  {
    id: 20,
    title: "The New Generation",
    unlockStars: 60000,
    description: "Become a mentor and guide new space cadets on their learning adventures!",
    story: "⭐ Years have passed, and now you stand where Commander Nova once stood, welcoming new cadets to StarSpace Academy! 'Remember,' you tell them with a warm smile, 'every expert was once a beginner. Your journey of learning never truly ends - it only gets more exciting!' You pass the Star Commander badge to a new generation of heroes.",
    mission: "Maintain 98% accuracy over 500 questions while helping mentor other students",
    reward: 3000,
    planet: "StarSpace Academy",
    unlocked: false
  },
  {
    id: 21,
    title: "The Infinite Adventure",
    unlockStars: 200000,
    description: "Discover that learning is truly infinite and the adventure continues forever!",
    story: "♾️ As you gaze out at the infinite cosmos, you realize your greatest adventure is just beginning! There are always new worlds to explore, new problems to solve, and new friends to help. The Crystal of Learning within you glows brighter than ever, ready for whatever challenges and discoveries await in the endless galaxy of knowledge!",
    mission: "Demonstrate legendary mastery: 99% accuracy on 1000 problems across all subjects",
    reward: 5000,
    planet: "The Infinite Cosmos",
    unlocked: false
  },
  {
    id: 22,
    title: "The Robo-Companion Alliance",
    unlockStars: 85000,
    description: "Meet Zyx-9, the super robot who becomes your mechanical best friend!",
    story: "🤖 At Tech Station, you encounter Zyx-9, a brilliant robot with rainbow LED emotions! 'BEEP BOOP! Finally, an organic friend who loves learning as much as I do!' he chirps. Together, you must debug the station's corrupted learning algorithms that are scrambling educational data across the galaxy!",
    mission: "Debug systems: Solve 45 logic puzzles with 92% accuracy alongside Zyx-9",
    reward: 4000,
    planet: "Tech Station",
    unlocked: false
  },
  {
    id: 23,
    title: "The Giggling Planet Crisis",
    unlockStars: 90000,
    description: "Visit Planet Gigglia where laughter powers all learning - but something's made everyone too serious!",
    story: "😂 You land on Planet Gigglia, where everything is shaped like smiling faces! But the Giggle King looks worried: 'The Grumpy Comet passed by and stole all our laughter! Without giggles, our students can't enjoy learning anymore. Help us remember that education should be FUN!'",
    mission: "Restore the giggles: Complete 35 fun word problems with 89% accuracy",
    reward: 4500,
    planet: "Planet Gigglia",
    unlocked: false
  },
  {
    id: 24,
    title: "The Memory Palace Mystery",
    unlockStars: 95000,
    description: "Explore the cosmic Library where every book in the universe is stored!",
    story: "📚 You discover the legendary Memory Palace, a vast library floating in space! Librarian Luna, made of stardust and stories, explains: 'Emperor Confusion has scrambled our catalog system! Books are flying everywhere, and students can't find the knowledge they need!'",
    mission: "Reorganize the library: Master 40 reading comprehension passages with 93% accuracy",
    reward: 5000,
    planet: "Memory Palace",
    unlocked: false
  },
  {
    id: 25,
    title: "The Sports Planet Championship",
    unlockStars: 100000,
    description: "Compete in the Intergalactic Learning Olympics on Planet Athletica!",
    story: "🏃‍♂️ Welcome to Planet Athletica, where learning meets sports! Coach Comet announces: 'The annual Brain Olympics are here! Compete in Mental Math Marathons, Reading Relays, and Problem-Solving Pentathlon! Show the galaxy that smart is the new strong!'",
    mission: "Win the Olympics: Complete 50 timed challenges with 90% accuracy",
    reward: 5500,
    planet: "Planet Athletica",
    unlocked: false
  },
  {
    id: 26,
    title: "The Dragon's Mathematical Riddles",
    unlockStars: 110000,
    description: "Face the wise Math Dragon who guards the entrance to Emperor Confusion's realm!",
    story: "🐉 At the edge of the Dark Nebula, you encounter Calculon the Math Dragon! 'None shall pass without proving their mathematical worth!' he roars. 'Answer my ancient riddles, young hero, and I shall grant you passage to face Emperor Confusion himself!'",
    mission: "Answer the dragon's riddles: Solve 30 expert-level problems with 95% accuracy",
    reward: 6000,
    planet: "Dragon's Gate",
    unlocked: false
  },
  {
    id: 27,
    title: "Infiltrating the Confusion Fortress",
    unlockStars: 125000,
    description: "Sneak into Emperor Confusion's dark fortress using stealth and smarts!",
    story: "🏰 You approach the towering Confusion Fortress, where Emperor Confusion has been scrambling educational content! Using your Learning Superpowers, you must solve increasingly difficult puzzles to disable the fortress's defense systems and reach the emperor!",
    mission: "Infiltrate the fortress: Complete 60 mixed problems with 94% accuracy",
    reward: 7000,
    planet: "Confusion Fortress",
    unlocked: false
  },
  {
    id: 28,
    title: "The Epic Battle with Emperor Confusion",
    unlockStars: 150000,
    description: "Face the ultimate villain in a battle of wits and knowledge!",
    story: "👑 At last, you face Emperor Confusion himself! 'So, you think you can defeat me with mere learning?' he sneers. 'I have spent eons creating doubt and confusion! But if you can solve my ultimate challenge, I will return all the stolen knowledge to the galaxy!'",
    mission: "Defeat the emperor: Master 75 ultimate challenges with 96% accuracy",
    reward: 8000,
    planet: "Confusion Throne Room",
    unlocked: false
  },
  {
    id: 29,
    title: "Restoring the Crystal of Learning",
    unlockStars: 175000,
    description: "Use your accumulated knowledge to repair the galaxy's source of all learning!",
    story: "💎 With Emperor Confusion defeated, you and all your friends gather around the damaged Crystal of Learning! Captain Stardust explains: 'Only someone who has truly mastered both Math and Reading can restore its power. Channel everything you've learned into this final moment!'",
    mission: "Restore the crystal: Demonstrate perfect mastery across 100 varied problems with 98% accuracy",
    reward: 10000,
    planet: "Crystal Chamber",
    unlocked: false
  },
  {
    id: 30,
    title: "The Infinite Learning Adventure",
    unlockStars: 200000,
    description: "Discover that your greatest adventure is just beginning!",
    story: "♾️ As the Crystal of Learning blazes with renewed power, you realize this isn't the end - it's just the beginning! The galaxy is safe, but there are infinite worlds to explore, infinite problems to solve, and infinite friends to help. Your journey as a Learning Hero continues forever!",
    mission: "Become a Legend: Demonstrate ultimate mastery with 99% accuracy on 150 problems",
    reward: 15000,
    planet: "The Infinite Cosmos",
    unlocked: false
  }
];

const SPACE_FRIENDS = [
  { name: "Captain Stardust", unlockStars: 400, description: "Your first friend and guide through the galaxy", emoji: "✨", planet: "Starport Academy", ability: "Navigation" },
  { name: "Professor Quantum", unlockStars: 800, description: "Wild scientist who created the Learning Toolkit", emoji: "🔬", planet: "Starport Academy", ability: "Super Science" },
  { name: "Captain Melody", unlockStars: 1200, description: "Musical pilot who loves crystal songs", emoji: "🎵", planet: "Planet Harmonia", ability: "Crystal Communication" },
  { name: "The Crystal Conductor", unlockStars: 1600, description: "Majestic being made of pure music notes", emoji: "🎼", planet: "Planet Harmonia", ability: "Harmony Control" },
  { name: "Zyx-9", unlockStars: 2000, description: "Super robot with rainbow LED emotions", emoji: "🤖", planet: "Tech Station", ability: "System Debugging" },
  { name: "Professor Chronos", unlockStars: 2500, description: "Guardian of time who protects educational history", emoji: "⏰", planet: "Time Vortex", ability: "Time Manipulation" },
  { name: "The Giggle King", unlockStars: 3000, description: "Ruler of Planet Gigglia who powers learning with laughter", emoji: "😂", planet: "Planet Gigglia", ability: "Laughter Energy" },
  { name: "Librarian Luna", unlockStars: 3500, description: "Made of stardust and stories from the Memory Palace", emoji: "📚", planet: "Memory Palace", ability: "Knowledge Organization" },
  { name: "Coach Comet", unlockStars: 4000, description: "Athletic trainer from the Learning Olympics", emoji: "🏃‍♂️", planet: "Planet Athletica", ability: "Speed Training" },
  { name: "Calculon the Math Dragon", unlockStars: 4500, description: "Wise dragon who guards the fortress entrance", emoji: "🐉", planet: "Dragon's Gate", ability: "Ancient Riddles" },
  { name: "The Bounce Guardians", unlockStars: 5000, description: "Gravity-controlling beings from Planet Bounce", emoji: "🌍", planet: "Planet Bounce", ability: "Gravity Control" },
  { name: "Prism the Light Weaver", unlockStars: 6000, description: "Creates rainbow bridges between learning concepts", emoji: "🌈", planet: "Rainbow Nexus", ability: "Light Magic" },
  { name: "Echo the Sound Sculptor", unlockStars: 7000, description: "Shapes sound waves to help with pronunciation", emoji: "🔊", planet: "Sound Caverns", ability: "Audio Manipulation" },
  { name: "Orbit the Planet Walker", unlockStars: 8000, description: "Giant being who can step between worlds", emoji: "👣", planet: "Between Worlds", ability: "Dimensional Travel" },
  { name: "The Number Ninjas", unlockStars: 9000, description: "Stealthy warriors who protect mathematical secrets", emoji: "🥷", planet: "Secret Dojo", ability: "Math Combat" },
  { name: "Crystal the Dream Keeper", unlockStars: 10000, description: "Guards the realm where learning dreams come true", emoji: "💤", planet: "Dream Dimension", ability: "Dream Control" },
  { name: "Spark the Idea Generator", unlockStars: 12000, description: "Creates brilliant flashes of understanding", emoji: "💡", planet: "Inspiration Station", ability: "Idea Creation" },
  { name: "Maze the Pattern Master", unlockStars: 15000, description: "Lives in geometric mazes and teaches logical thinking", emoji: "🌀", planet: "Pattern Maze", ability: "Logic Patterns" },
  { name: "Phoenix the Resilience Teacher", unlockStars: 18000, description: "Shows students how to rise from learning mistakes", emoji: "🔥", planet: "Resilience Peak", ability: "Comeback Power" },
  { name: "Stellar the Constellation Creator", unlockStars: 22000, description: "Connects knowledge points like stars in the sky", emoji: "⭐", planet: "Star Factory", ability: "Connection Making" },
  { name: "Wisdom the Ancient Oracle", unlockStars: 27000, description: "Speaks in riddles that unlock deep understanding", emoji: "🔮", planet: "Oracle Temple", ability: "Wisdom Prophecy" },
  { name: "The Learning Council", unlockStars: 35000, description: "Five wise beings who govern educational excellence", emoji: "🏛️", planet: "Council Chambers", ability: "Collective Wisdom" },
  { name: "Emperor Confusion (Reformed)", unlockStars: 50000, description: "Former villain who now helps clear mental blocks", emoji: "👑", planet: "Reformed Fortress", ability: "Confusion Clearing" },
  { name: "The Crystal of Learning", unlockStars: 75000, description: "The living source of all knowledge in the galaxy", emoji: "💎", planet: "Crystal Chamber", ability: "Pure Knowledge" },
  { name: "The Infinite Guardian", unlockStars: 100000, description: "Protector of endless learning possibilities", emoji: "♾️", planet: "Infinite Realm", ability: "Limitless Growth" }
];

const GALAXY_LOCATIONS = [
  { name: "Earth's Roof", unlockChapter: 1, x: 5, y: 95, emoji: "🏠", description: "Where your cosmic adventure began", type: "origin", connections: [1] },
  { name: "Starport Academy", unlockChapter: 2, x: 50, y: 80, emoji: "🏫", description: "Training ground for galactic heroes", type: "hub", connections: [2, 3] },
  { name: "Planet Harmonia", unlockChapter: 4, x: 20, y: 60, emoji: "🎵", description: "Musical world of crystal singers", type: "planet", connections: [4, 5] },
  { name: "Tech Station", unlockChapter: 6, x: 75, y: 70, emoji: "🤖", description: "Zyx-9's robotic wonderland", type: "station", connections: [6] },
  { name: "Time Vortex", unlockChapter: 7, x: 40, y: 20, emoji: "⏰", description: "Where past and future collide", type: "anomaly", connections: [7] },
  { name: "Planet Gigglia", unlockChapter: 8, x: 85, y: 45, emoji: "😂", description: "World powered by laughter", type: "planet", connections: [8] },
  { name: "Memory Palace", unlockChapter: 9, x: 30, y: 40, emoji: "📚", description: "Cosmic library of all knowledge", type: "palace", connections: [9] },
  { name: "Planet Athletica", unlockChapter: 10, x: 60, y: 90, emoji: "🏃‍♂️", description: "Home of the Learning Olympics", type: "planet", connections: [10] },
  { name: "Dragon's Gate", unlockChapter: 11, x: 90, y: 25, emoji: "🐉", description: "Calculon's riddle fortress", type: "gate", connections: [11] },
  { name: "Planet Bounce", unlockChapter: 12, x: 15, y: 85, emoji: "🌍", description: "Gravity-defying sports world", type: "planet", connections: [12] },
  { name: "Rainbow Nexus", unlockChapter: 13, x: 70, y: 30, emoji: "🌈", description: "Prism's light-weaving realm", type: "nexus", connections: [13] },
  { name: "Sound Caverns", unlockChapter: 14, x: 25, y: 15, emoji: "🔊", description: "Echo's acoustic wonderland", type: "cavern", connections: [14] },
  { name: "Between Worlds", unlockChapter: 15, x: 55, y: 50, emoji: "👣", description: "Orbit's dimensional crossroads", type: "void", connections: [15] },
  { name: "Secret Dojo", unlockChapter: 16, x: 80, y: 85, emoji: "🥷", description: "Number Ninjas training ground", type: "hidden", connections: [16] },
  { name: "Dream Dimension", unlockChapter: 17, x: 10, y: 50, emoji: "💤", description: "Crystal's realm of learning dreams", type: "dimension", connections: [17] },
  { name: "Inspiration Station", unlockChapter: 18, x: 65, y: 15, emoji: "💡", description: "Spark's idea-generating hub", type: "station", connections: [18] },
  { name: "Pattern Maze", unlockChapter: 19, x: 35, y: 75, emoji: "🌀", description: "Maze's geometric labyrinth", type: "maze", connections: [19] },
  { name: "Resilience Peak", unlockChapter: 20, x: 85, y: 10, emoji: "🔥", description: "Phoenix's comeback mountain", type: "peak", connections: [20] },
  { name: "Star Factory", unlockChapter: 21, x: 45, y: 35, emoji: "⭐", description: "Stellar's constellation workshop", type: "factory", connections: [21] },
  { name: "Oracle Temple", unlockChapter: 22, x: 15, y: 25, emoji: "🔮", description: "Wisdom's ancient prophecy hall", type: "temple", connections: [22] },
  { name: "Council Chambers", unlockChapter: 23, x: 75, y: 55, emoji: "🏛️", description: "The Learning Council's headquarters", type: "government", connections: [23] },
  { name: "Reformed Fortress", unlockChapter: 24, x: 95, y: 60, emoji: "👑", description: "Emperor Confusion's new home", type: "fortress", connections: [24] },
  { name: "Crystal Chamber", unlockChapter: 25, x: 50, y: 65, emoji: "💎", description: "Heart of all galactic learning", type: "core", connections: [25] },
  { name: "Confusion Fortress", unlockChapter: 27, x: 5, y: 5, emoji: "🏰", description: "The dark emperor's stronghold", type: "evil", connections: [27] },
  { name: "Confusion Throne Room", unlockChapter: 28, x: 3, y: 3, emoji: "⚔️", description: "Final battle arena", type: "boss", connections: [28] },
  { name: "Infinite Realm", unlockChapter: 30, x: 50, y: 5, emoji: "♾️", description: "Beyond all understanding", type: "infinite", connections: [30] },
  { name: "Asteroid Field", unlockChapter: 4, x: 65, y: 75, emoji: "☄️", description: "Dangerous space debris", type: "hazard", connections: [] },
  { name: "Wormhole Junction", unlockChapter: 15, x: 40, y: 60, emoji: "🌀", description: "Instant travel network", type: "portal", connections: [] },
  { name: "Dark Nebula", unlockChapter: 26, x: 20, y: 8, emoji: "🌑", description: "Approach to evil's domain", type: "dark", connections: [] },
  { name: "Victory Celebration", unlockChapter: 29, x: 50, y: 45, emoji: "🎉", description: "Heroes' triumph gathering", type: "celebration", connections: [] }
];

const SPACE_ACHIEVEMENTS = [
  { name: "First Contact", description: "Meet your first space friend", emoji: "👋", unlockStars: 500, story: "Make contact with Captain Stardust" },
  { name: "Toolkit Master", description: "Unlock the legendary Learning Toolkit", emoji: "🔧", unlockStars: 1000, story: "Receive Professor Quantum's golden toolkit" },
  { name: "Crystal Singer", description: "Restore the harmony of Planet Harmonia", emoji: "🎵", unlockStars: 2000, story: "Help the Crystal Conductor rebuild the choir" },
  { name: "Time Traveler", description: "Navigate the dangerous Time Vortex", emoji: "⏰", unlockStars: 3000, story: "Survive Professor Chronos's timeline tests" },
  { name: "Laughter Bringer", description: "Restore giggles to Planet Gigglia", emoji: "😂", unlockStars: 4000, story: "Help the Giggle King find his joy again" },
  { name: "Knowledge Keeper", description: "Reorganize the cosmic Memory Palace", emoji: "📚", unlockStars: 5000, story: "Assist Librarian Luna with the scattered books" },
  { name: "Olympic Champion", description: "Win gold at the Learning Olympics", emoji: "🏆", unlockStars: 7500, story: "Triumph in Coach Comet's Brain Olympics" },
  { name: "Dragon Whisperer", description: "Answer all of Calculon's riddles", emoji: "🐉", unlockStars: 10000, story: "Earn the Math Dragon's respect and passage" },
  { name: "Gravity Defier", description: "Master the physics of Planet Bounce", emoji: "🌍", unlockStars: 12500, story: "Learn to control gravity with the Bounce Guardians" },
  { name: "Rainbow Bridge Builder", description: "Connect learning concepts with Prism", emoji: "🌈", unlockStars: 15000, story: "Help Prism weave bridges between ideas" },
  { name: "Dream Walker", description: "Enter Crystal's learning dream realm", emoji: "💤", unlockStars: 17500, story: "Navigate the dimension where dreams become reality" },
  { name: "Idea Spark", description: "Generate brilliant flashes with Spark", emoji: "💡", unlockStars: 20000, story: "Create new ideas at Inspiration Station" },
  { name: "Pattern Solver", description: "Escape Maze's geometric labyrinth", emoji: "🌀", unlockStars: 22500, story: "Master logical thinking in the Pattern Maze" },
  { name: "Phoenix Rising", description: "Learn resilience from Phoenix", emoji: "🔥", unlockStars: 25000, story: "Rise from learning mistakes on Resilience Peak" },
  { name: "Star Creator", description: "Help Stellar build new constellations", emoji: "⭐", unlockStars: 30000, story: "Connect knowledge points like stars in the sky" },
  { name: "Oracle's Student", description: "Decode Wisdom's ancient prophecies", emoji: "🔮", unlockStars: 35000, story: "Understand the riddles of the Oracle Temple" },
  { name: "Council Member", description: "Join the Learning Council's ranks", emoji: "🏛️", unlockStars: 40000, story: "Earn a seat among the galaxy's wisest beings" },
  { name: "Confusion Reformer", description: "Help Emperor Confusion change his ways", emoji: "👑", unlockStars: 50000, story: "Convert the former villain into an ally" },
  { name: "Fortress Infiltrator", description: "Sneak into the Confusion Fortress", emoji: "🏰", unlockStars: 75000, story: "Use stealth and smarts to breach defenses" },
  { name: "Emperor Defeater", description: "Triumph over Emperor Confusion", emoji: "⚔️", unlockStars: 100000, story: "Win the ultimate battle of wits and knowledge" },
  { name: "Crystal Restorer", description: "Repair the galaxy's source of learning", emoji: "💎", unlockStars: 125000, story: "Channel all knowledge to heal the crystal" },
  { name: "Legend of Learning", description: "Become a galactic learning hero", emoji: "🌟", unlockStars: 150000, story: "Achieve legendary status across the cosmos" },
  { name: "Infinite Explorer", description: "Reach the endless realm of possibilities", emoji: "♾️", unlockStars: 200000, story: "Discover that learning truly has no limits" },
  { name: "Master of All", description: "Achieve 95% accuracy across all subjects", emoji: "🎯", unlockStars: 175000, story: "Demonstrate complete mastery of knowledge" },
  { name: "Speed Scholar", description: "Complete 100 problems in under 10 minutes", emoji: "⚡", unlockStars: 50000, story: "Prove your lightning-fast thinking skills" }
];

export default function StarSpaceStoryTab({ user, starPower }: StarSpaceStoryTabProps) {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [discoveredFriends, setDiscoveredFriends] = useState<string[]>([]);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Unlock logic based on StarPower
  const unlockedChapters = STORY_CHAPTERS.filter(chapter => starPower >= chapter.unlockStars);
  const unlockedFriends = SPACE_FRIENDS.filter(friend => starPower >= friend.unlockStars);
  const unlockedAchievements = SPACE_ACHIEVEMENTS.filter(achievement => starPower >= achievement.unlockStars);
  const unlockedLocations = GALAXY_LOCATIONS.filter(location => 
    unlockedChapters.some(chapter => chapter.id >= location.unlockChapter)
  );

  const handleStartMission = (chapterId: number) => {
    // Redirect to practice questions based on chapter requirements
    const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
    if (chapter) {
      // Determine subject and difficulty based on chapter
      const subject = chapterId % 2 === 0 ? 'reading' : 'math';
      
      // Trigger practice modal with specific requirements
      const event = new CustomEvent('startPractice', {
        detail: {
          subject: subject,
          category: 'all',
          missionContext: {
            chapterId,
            title: chapter.title,
            mission: chapter.mission
          }
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with current progress */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="w-8 h-8" />
                StarSpace Adventure
              </CardTitle>
              <p className="text-blue-100">Your epic journey through the cosmos of learning!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{starPower.toLocaleString()}</div>
              <div className="text-blue-200">StarPower Collected</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="story" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="story" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Story
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Space Friends
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Galaxy Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORY_CHAPTERS.map((chapter) => {
              const isUnlocked = starPower >= chapter.unlockStars;
              const isCompleted = completedMissions.includes(chapter.id);
              
              return (
                <Card 
                  key={chapter.id} 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isUnlocked 
                      ? isCompleted 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={isUnlocked ? isCompleted ? "default" : "secondary" : "outline"}>
                        Chapter {chapter.id}
                      </Badge>
                      {isCompleted && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                    </div>
                    <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    <p className="text-sm text-gray-600">{chapter.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm">{chapter.story}</p>
                    </div>
                    
                    {isUnlocked && !isCompleted && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Mission:</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">{chapter.mission}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">+{chapter.reward} StarPower</span>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleStartMission(chapter.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Mission
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!isUnlocked && (
                      <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            Unlock at {chapter.unlockStars.toLocaleString()} StarPower
                          </span>
                        </div>
                        <Progress 
                          value={(starPower / chapter.unlockStars) * 100} 
                          className="mt-2 h-2"
                        />
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="text-center py-2">
                        <Badge className="bg-green-500 text-white">
                          Mission Complete! ⭐
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPACE_FRIENDS.map((friend) => {
              const isUnlocked = starPower >= friend.unlockStars;
              
              return (
                <Card 
                  key={friend.name} 
                  className={`transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-2">{friend.emoji}</div>
                    <CardTitle className="text-xl">{friend.name}</CardTitle>
                    <p className="text-sm text-gray-600">{friend.description}</p>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    {isUnlocked ? (
                      <Badge className="bg-green-500 text-white">
                        Friend Discovered! 🎉
                      </Badge>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            Unlock at {friend.unlockStars.toLocaleString()} StarPower
                          </span>
                        </div>
                        <Progress 
                          value={(starPower / friend.unlockStars) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPACE_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = starPower >= achievement.unlockStars;
              
              return (
                <Card 
                  key={achievement.name} 
                  className={`transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.emoji}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {isUnlocked ? (
                      <Badge className="bg-yellow-500 text-white">
                        Achievement Unlocked! 🏆
                      </Badge>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            Unlock at {achievement.unlockStars.toLocaleString()} StarPower
                          </span>
                        </div>
                        <Progress 
                          value={(starPower / achievement.unlockStars) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                🌌 Galactic Timeline Adventure 🌌
              </CardTitle>
              <p className="text-center text-purple-200">
                Scroll through your epic journey - {Math.max(1, unlockedChapters.length)}/30 Chapters Unlocked
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 rounded-2xl overflow-hidden shadow-2xl">
                {/* Scrollable Galaxy Container */}
                <div className="h-[700px] overflow-y-auto scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-violet-500/70 hover:scrollbar-thumb-violet-400/90">
                  <div className="relative min-h-[2800px] p-6">
                    
                    {/* Beautiful Starfield Background */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Large bright stars */}
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={`bright-star-${i}`}
                          className="absolute bg-white rounded-full animate-twinkle drop-shadow-sm"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${3 + Math.random() * 2}px`,
                            height: `${3 + Math.random() * 2}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        />
                      ))}
                      
                      {/* Medium stars */}
                      {[...Array(60)].map((_, i) => (
                        <div
                          key={`med-star-${i}`}
                          className="absolute bg-blue-100 rounded-full animate-twinkle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `2px`,
                            height: `2px`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${4 + Math.random() * 3}s`,
                          }}
                        />
                      ))}
                      
                      {/* Small distant stars */}
                      {[...Array(80)].map((_, i) => (
                        <div
                          key={`small-star-${i}`}
                          className="absolute bg-slate-300 rounded-full opacity-40"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `1px`,
                            height: `1px`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Elegant Cosmic Clouds */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={`cloud-${i}`}
                          className="absolute rounded-full"
                          style={{
                            left: `${15 + (i * 20)}%`,
                            top: `${20 + (i * 15)}%`,
                            width: `${200 + (i * 50)}px`,
                            height: `${120 + (i * 30)}px`,
                            background: `radial-gradient(ellipse, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)`,
                            animation: `float ${8 + i * 2}s ease-in-out infinite`,
                            animationDelay: `${i * 1.5}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Clean Chapter Timeline */}
                    <div className="flex flex-col items-center space-y-8 pt-8">
                      {STORY_CHAPTERS.slice(0, 30).map((chapter, index) => {
                        const isUnlocked = unlockedChapters.some(c => c.id === chapter.id);
                        const character = SPACE_FRIENDS.find(f => f.unlockStars <= chapter.unlockStars && f.unlockStars >= (STORY_CHAPTERS[index - 1]?.unlockStars || 0));
                        
                        return (
                          <div key={chapter.id} className="w-full max-w-2xl mx-auto">
                            
                            {/* Chapter Card */}
                            <div className={`relative transition-all duration-500 ${
                              isUnlocked 
                                ? 'bg-white/10 border border-violet-400/30 shadow-xl shadow-violet-500/20' 
                                : 'bg-slate-800/40 border border-slate-600/30 opacity-60'
                            } backdrop-blur-sm rounded-3xl p-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/30`}>
                              
                              {/* Chapter Header */}
                              <div className="flex items-center gap-6 mb-4">
                                
                                {/* Planet Icon */}
                                <div className={`relative ${isUnlocked ? 'animate-float' : ''}`}>
                                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-3 transition-all duration-500 ${
                                    isUnlocked 
                                      ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 border-amber-300 shadow-xl shadow-amber-500/50' 
                                      : 'bg-slate-700 border-slate-600'
                                  }`}>
                                    <span className="text-3xl">
                                      {chapter.planet === "Earth's Roof" ? "🏠" :
                                       chapter.planet === "Starport Academy" ? "🏫" :
                                       chapter.planet === "Planet Harmonia" ? "🎵" :
                                       chapter.planet === "Tech Station" ? "🤖" :
                                       chapter.planet === "Time Vortex" ? "⏰" :
                                       chapter.planet === "Planet Gigglia" ? "😂" :
                                       chapter.planet === "Memory Palace" ? "📚" :
                                       chapter.planet === "Planet Athletica" ? "🏃‍♂️" :
                                       chapter.planet === "Dragon's Gate" ? "🐉" :
                                       chapter.planet === "Confusion Fortress" ? "🏰" :
                                       chapter.planet === "The Infinite Cosmos" ? "♾️" : "🌟"}
                                    </span>
                                  </div>
                                  {isUnlocked && (
                                    <div className="absolute inset-0 border-2 border-violet-400/40 rounded-full animate-ping"></div>
                                  )}
                                </div>

                                {/* Chapter Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className={`font-bold text-2xl ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                      Chapter {chapter.id}
                                    </h3>
                                    {!isUnlocked && (
                                      <div className="bg-slate-700/50 px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="text-lg">🔒</span>
                                        <span className="text-sm text-slate-300">Locked</span>
                                      </div>
                                    )}
                                  </div>
                                  <h4 className={`text-lg font-semibold mb-3 ${isUnlocked ? 'text-violet-200' : 'text-slate-500'}`}>
                                    {chapter.title}
                                  </h4>
                                  
                                  {/* Character Introduction */}
                                  {character && isUnlocked && (
                                    <div className="bg-violet-800/30 rounded-xl p-3 mb-3 border border-violet-500/30">
                                      <div className="flex items-center gap-3">
                                        <span className="text-2xl">{character.emoji}</span>
                                        <div>
                                          <p className="font-semibold text-violet-200">{character.name}</p>
                                          <p className="text-sm text-violet-300">{character.ability}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Story & Mission Content */}
                              {isUnlocked && (
                                <div className="mb-6">
                                  <p className="text-slate-200 mb-4 leading-relaxed">
                                    {chapter.story.substring(0, 200)}...
                                  </p>
                                  
                                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                                    <h5 className="font-semibold text-amber-300 mb-2">Mission Objective:</h5>
                                    <p className="text-slate-300 mb-3 leading-relaxed">{chapter.mission}</p>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                                        <span className="text-emerald-300 font-semibold">Reward: +{chapter.reward} SP</span>
                                      </div>
                                      <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                                        <span className="text-blue-300 text-sm">Requires: {chapter.unlockStars.toLocaleString()} SP</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Action Button */}
                              <div className="flex justify-center">
                                {isUnlocked ? (
                                  <button
                                    onClick={() => handleStartMission(chapter.id)}
                                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                                  >
                                    <span className="text-lg">🚀</span>
                                    Launch Mission
                                  </button>
                                ) : (
                                  <div className="bg-slate-700/50 text-slate-400 font-medium py-4 px-8 rounded-2xl flex items-center gap-3">
                                    <span className="text-lg">🔒</span>
                                    Mission Locked
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-xl text-xs z-30 border border-yellow-400/50">
                      <div className="text-yellow-300 font-bold mb-1">🌟 Journey Progress</div>
                      <div>Chapter: {Math.max(1, unlockedChapters.length)}/30</div>
                      <div>StarPower: {starPower.toLocaleString()}</div>
                      <div>Friends: {unlockedFriends.length}/25</div>
                    </div>

                    {/* Scroll Instructions */}
                    <div className="absolute top-4 right-4 bg-black/90 text-white p-3 rounded-xl text-xs z-30 border border-purple-400/50">
                      <div className="text-purple-300 font-bold mb-1">📜 Navigation</div>
                      <div>Scroll to explore timeline</div>
                      <div>Click Start Mission to practice</div>
                      <div>Unlock new chapters with StarPower</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}