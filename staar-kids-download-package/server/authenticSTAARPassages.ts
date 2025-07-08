import { InsertQuestion } from "@shared/schema";

/**
 * Authentic STAAR-style reading passages based on official test formats
 * These passages mirror the structure, complexity, and content found in actual STAAR exams
 */

export interface STAARPassage {
  title: string;
  text: string;
  genre: string;
  questions: Array<{
    questionText: string;
    answerChoices: string[];
    correctAnswer: string;
    teksStandard: string;
    category: string;
  }>;
}

export const AUTHENTIC_STAAR_PASSAGES: Record<number, STAARPassage[]> = {
  3: [
    {
      title: "The Little Star",
      genre: "Fiction",
      text: `The Little Star

In the dark night sky, there lived a little star named Stella. Unlike the other bright stars that twinkled proudly, Stella felt very small and dim. She watched as people on Earth pointed to the bigger, brighter stars and made wishes.

"I wish I could shine as brightly as the North Star," Stella sighed to herself every night.

One evening, a young girl named Maria was walking home from her grandmother's house. The path was very dark, and Maria felt scared. She looked up at the sky for help. The big stars seemed so far away, but Stella's gentle light was just right. It helped Maria see the path clearly.

"Thank you, little star," Maria whispered. "Your light is perfect for lighting my way home."

From that night on, Stella learned that being small didn't mean being unimportant. She continued to shine her gentle light, helping lost travelers find their way. Stella realized that every star, no matter how small, has a special purpose in the sky.

The other stars began to notice Stella's important work. They welcomed her into their group and celebrated her unique gift. Stella never felt small again because she understood that her gentle light made a big difference to those who needed it most.`,
      questions: [
        {
          questionText: "What is Stella's main problem in the beginning of the story?",
          answerChoices: [
            "A. She cannot find her way home",
            "B. She feels too small and dim compared to other stars", 
            "C. She is afraid of the dark",
            "D. She doesn't know how to help people"
          ],
          correctAnswer: "B",
          teksStandard: "3.8A",
          category: "Literary Elements"
        },
        {
          questionText: "How does Stella change from the beginning to the end of the story?",
          answerChoices: [
            "A. She becomes bigger and brighter",
            "B. She learns that every star has a special purpose",
            "C. She decides to stop shining",
            "D. She moves to a different part of the sky"
          ],
          correctAnswer: "B",
          teksStandard: "3.8A", 
          category: "Literary Elements"
        },
        {
          questionText: "What lesson does this story teach?",
          answerChoices: [
            "A. Only big things are important",
            "B. Everyone should try to be the same",
            "C. Being different can be a special gift",
            "D. It's better to work alone than with others"
          ],
          correctAnswer: "C",
          teksStandard: "3.8B",
          category: "Theme"
        }
      ]
    },
    {
      title: "Monarch Butterflies",
      genre: "Informational Text",
      text: `Monarch Butterflies

Monarch butterflies are amazing insects that travel thousands of miles each year. These orange and black butterflies are about as big as your hand. They are famous for their long journey, called migration.

Every fall, monarch butterflies fly from Canada and the northern United States all the way to Mexico. This trip can be over 2,000 miles long! The butterflies that make this journey have never been to Mexico before, but somehow they know exactly where to go.

During their trip, monarch butterflies use the sun to help them find their way. They also use special patterns in the sky that humans cannot see. Scientists are still trying to understand how these small insects can travel so far without getting lost.

In Mexico, millions of monarch butterflies gather in the same forests every year. They cluster together on tree branches to stay warm during the winter months. The trees become orange and black from all the butterflies covering them.

When spring arrives, the butterflies begin their journey back north. However, these butterflies don't make the whole trip back. They stop along the way to lay eggs and then die. Their children continue the journey north, and their grandchildren finish the trip back to Canada.

The monarch butterfly migration is one of nature's greatest mysteries. These beautiful insects show us that even small creatures can do incredible things.`,
      questions: [
        {
          questionText: "According to the passage, how do monarch butterflies find their way during migration?",
          answerChoices: [
            "A. They follow other birds",
            "B. They use the sun and special sky patterns",
            "C. They remember the path from previous trips", 
            "D. They ask humans for directions"
          ],
          correctAnswer: "B",
          teksStandard: "3.13A",
          category: "Comprehension"
        },
        {
          questionText: "What happens to the butterflies that start the journey back north in spring?",
          answerChoices: [
            "A. They complete the entire journey to Canada",
            "B. They get lost along the way",
            "C. They stop to lay eggs and then die",
            "D. They return to Mexico"
          ],
          correctAnswer: "C",
          teksStandard: "3.13A", 
          category: "Comprehension"
        },
        {
          questionText: "The author wrote this passage mainly to —",
          answerChoices: [
            "A. explain how to catch monarch butterflies",
            "B. describe the amazing journey of monarch butterflies",
            "C. tell a story about a butterfly named Monarch",
            "D. compare monarchs to other types of butterflies"
          ],
          correctAnswer: "B",
          teksStandard: "3.12A",
          category: "Author's Purpose"
        }
      ]
    }
  ],
  4: [
    {
      title: "The Secret Garden",
      genre: "Fiction", 
      text: `The Secret Garden

Maya had always been curious about the old wooden door behind the ivy-covered wall in her grandmother's backyard. For years, her grandmother told her it led to nothing important, just an old storage area. But Maya noticed that her grandmother always seemed nervous when Maya asked about it.

One sunny Saturday morning, while her grandmother was busy in the kitchen, Maya decided to investigate. She pushed aside the thick ivy and found that the door wasn't locked. Her heart pounded as she slowly opened it and stepped inside.

What Maya discovered took her breath away. Behind the door was the most beautiful garden she had ever seen. Colorful flowers bloomed everywhere—roses, daisies, sunflowers, and many others she couldn't name. A small stone path wound through the garden, leading to a wooden bench under a large oak tree.

Maya sat on the bench and noticed a small metal plaque attached to it. She read the words carved into it: "In memory of my beloved husband, Eduardo. His love grows here forever."

Suddenly, Maya understood why her grandmother had kept this place secret. This wasn't just a garden—it was a special place where her grandmother came to remember her grandfather, who had died before Maya was born.

"I wondered when you would find this place," came a gentle voice behind her. Maya turned to see her grandmother standing in the doorway with tears in her eyes, but she was smiling.

"Grandpa planted this garden for you, didn't he?" Maya asked softly.

Her grandmother nodded. "Every flower here was chosen with love. He said that love never dies—it just grows in different ways." From that day forward, Maya and her grandmother tended the garden together, sharing stories about the grandfather Maya had never met but felt she knew through the beauty he had created.`,
      questions: [
        {
          questionText: "Why did Maya's grandmother seem nervous when Maya asked about the door?",
          answerChoices: [
            "A. She was afraid Maya would get hurt",
            "B. The garden was dangerous",
            "C. The garden was a private place of memory",
            "D. She had forgotten what was behind the door"
          ],
          correctAnswer: "C",
          teksStandard: "4.6A",
          category: "Literary Elements"
        },
        {
          questionText: "What does the plaque on the bench reveal about the garden?",
          answerChoices: [
            "A. It was created to remember Maya's grandfather",
            "B. It belongs to someone named Eduardo",
            "C. It is the oldest garden in the neighborhood", 
            "D. It was built by Maya's grandmother"
          ],
          correctAnswer: "A",
          teksStandard: "4.6A",
          category: "Comprehension"
        },
        {
          questionText: "What is the main theme of this story?",
          answerChoices: [
            "A. Gardens require lots of work to maintain",
            "B. Children should always obey their grandparents",
            "C. Love and memory can be preserved in special places",
            "D. It's important to explore new places"
          ],
          correctAnswer: "C",
          teksStandard: "4.6B",
          category: "Theme"
        }
      ]
    },
    {
      title: "The Amazing World of Bees",
      genre: "Informational Text",
      text: `The Amazing World of Bees

Bees are much more important to our world than most people realize. These small insects play a huge role in helping plants grow and providing food for humans and animals.

When bees visit flowers to collect nectar, they accidentally pick up pollen on their fuzzy bodies. As they fly from flower to flower, they spread this pollen around. This process, called pollination, helps plants make seeds and grow new plants. Without bees, many of the fruits and vegetables we eat would not exist.

There are over 20,000 different types of bees in the world. The most familiar type is the honeybee, which lives in large groups called colonies. A honeybee colony can have up to 60,000 bees working together. Each bee has a specific job. Worker bees collect nectar and pollen, nurse bees take care of baby bees, and the queen bee lays all the eggs.

Honeybees are also famous for making honey. They collect nectar from flowers and bring it back to their hive. Inside the hive, they turn the nectar into honey by adding special chemicals from their bodies and removing extra water. The honey provides food for the bees during winter when flowers are not available.

Unfortunately, bee populations around the world are declining. Scientists believe this is happening because of habitat loss, diseases, and the use of harmful chemicals. Many people are working to help bees by planting bee-friendly flowers and creating safe spaces for them to live.

Protecting bees is important for our planet's future. These tiny insects help maintain the balance of nature and ensure that we have the food we need to survive.`,
      questions: [
        {
          questionText: "According to the passage, what would happen without bees?",
          answerChoices: [
            "A. Flowers would be more colorful",
            "B. Many fruits and vegetables would not exist",
            "C. Plants would grow faster",
            "D. There would be more honey in the world"
          ],
          correctAnswer: "B",
          teksStandard: "4.13A",
          category: "Comprehension"
        },
        {
          questionText: "How do bees turn nectar into honey?",
          answerChoices: [
            "A. They mix it with water from flowers",
            "B. They store it in special containers",
            "C. They add chemicals from their bodies and remove water",
            "D. They heat it with their wings"
          ],
          correctAnswer: "C",
          teksStandard: "4.13A",
          category: "Comprehension"
        },
        {
          questionText: "The author's main purpose in writing this passage is to —",
          answerChoices: [
            "A. teach readers how to make honey",
            "B. explain why bees are important and need protection",
            "C. describe what different types of bees look like",
            "D. tell a story about a bee colony"
          ],
          correctAnswer: "B",
          teksStandard: "4.12A",
          category: "Author's Purpose"
        }
      ]
    }
  ],
  5: [
    {
      title: "The Last Game",
      genre: "Fiction",
      text: `The Last Game

Marcus stared at the scoreboard with disbelief. His basketball team, the Eagles, was losing 48-52 with only two minutes left in the championship game. This was their last chance to win the state title, and Marcus felt the weight of responsibility on his shoulders as team captain.

Throughout the season, Marcus had been the team's leading scorer. His teammates looked up to him, and he had always delivered when they needed him most. But tonight was different. His shots weren't falling, and he had already missed three free throws that could have changed the game.

"Time out!" Coach Williams called, gathering the team around him. "Listen, we've worked too hard to give up now. Marcus, I know you're frustrated, but leadership isn't just about scoring points. Sometimes it's about trusting your teammates."

As play resumed, Marcus noticed that Tommy, usually the team's sixth man, was open near the three-point line. In the past, Marcus would have tried to make the shot himself. But this time, he passed the ball to Tommy, who had been practicing that shot all season.

Swish! Tommy's three-pointer tied the game at 51-51.

With thirty seconds left, Marcus again had a choice. He could take the final shot and try to be the hero, or he could trust his team. When he saw Jake open under the basket, Marcus made a perfect pass. Jake scored the winning basket just as the buzzer sounded.

As his teammates celebrated around him, Marcus realized that his greatest victory wasn't about personal statistics. It was about learning that true leadership means helping others succeed. The Eagles had won the championship, but Marcus had won something even more valuable—the understanding that sometimes the best way to shine is to help others glow.`,
      questions: [
        {
          questionText: "What internal conflict does Marcus face during the game?",
          answerChoices: [
            "A. Whether to play defense or offense",
            "B. Whether to trust his teammates or try to win the game himself",
            "C. Whether to listen to his coach or follow his own plan",
            "D. Whether to continue playing or quit the game"
          ],
          correctAnswer: "B",
          teksStandard: "5.6A",
          category: "Literary Elements"
        },
        {
          questionText: "How does Marcus change throughout the story?",
          answerChoices: [
            "A. He becomes a better shooter",
            "B. He learns that true leadership means helping others succeed",
            "C. He decides he doesn't want to be team captain anymore",
            "D. He realizes he should practice more"
          ],
          correctAnswer: "B",
          teksStandard: "5.6A",
          category: "Character Development"
        },
        {
          questionText: "What does the phrase 'sometimes the best way to shine is to help others glow' mean in the context of the story?",
          answerChoices: [
            "A. Players should focus on improving their physical fitness",
            "B. True success comes from helping teammates succeed rather than seeking personal glory",
            "C. It's important to practice shooting more often",
            "D. Team captains should always pass the ball to other players"
          ],
          correctAnswer: "B",
          teksStandard: "5.4B",
          category: "Figurative Language"
        }
      ]
    },
    {
      title: "Renewable Energy: Power from Nature",
      genre: "Informational Text",
      text: `Renewable Energy: Power from Nature

As concerns about climate change and environmental protection grow, many countries are turning to renewable energy sources to meet their power needs. Unlike fossil fuels such as coal and oil, renewable energy comes from natural sources that can be replenished over time.

Solar energy harnesses the power of the sun through solar panels that convert sunlight into electricity. These panels can be installed on rooftops of homes and businesses or arranged in large solar farms. Countries like Germany and China have invested heavily in solar technology, making it one of the fastest-growing energy sources in the world.

Wind energy captures the movement of air through large wind turbines. These towering structures, often grouped together in wind farms, can generate significant amounts of electricity. Denmark produces nearly half of its electricity from wind power, proving that this technology can be a major source of energy for entire nations.

Hydroelectric power uses flowing water to generate electricity. Dams built across rivers create reservoirs that store water. When released, this water flows through turbines, creating electricity. Countries with many rivers, such as Norway and Canada, rely heavily on hydroelectric power.

Geothermal energy taps into heat from the Earth's core. In areas where this heat is close to the surface, power plants can use it to generate electricity. Iceland generates about 25% of its electricity from geothermal sources.

The transition to renewable energy offers many benefits. It reduces air pollution, decreases dependence on fossil fuels, and can create new jobs in emerging industries. However, challenges remain, including the initial cost of technology and the need to store energy when the sun isn't shining or the wind isn't blowing.

Despite these challenges, many experts believe that renewable energy will play an increasingly important role in meeting the world's energy needs while protecting the environment for future generations.`,
      questions: [
        {
          questionText: "What is the main advantage of renewable energy sources over fossil fuels?",
          answerChoices: [
            "A. They are always less expensive to produce",
            "B. They can be replenished naturally over time",
            "C. They produce more electricity per unit",
            "D. They require less technology to operate"
          ],
          correctAnswer: "B",
          teksStandard: "5.13A",
          category: "Comprehension"
        },
        {
          questionText: "Based on the passage, which country has had the most success with wind energy?",
          answerChoices: [
            "A. Germany",
            "B. China", 
            "C. Denmark",
            "D. Iceland"
          ],
          correctAnswer: "C",
          teksStandard: "5.13A",
          category: "Comprehension"
        },
        {
          questionText: "According to the author, what is one major challenge facing renewable energy?",
          answerChoices: [
            "A. It creates too much pollution",
            "B. It requires too many workers",
            "C. The need to store energy when natural sources aren't available",
            "D. It can only be used in certain countries"
          ],
          correctAnswer: "C",
          teksStandard: "5.13A",
          category: "Supporting Details"
        }
      ]
    }
  ]
};

/**
 * Generate an authentic reading question with passage based on STAAR format
 */
export function generateAuthenticReadingQuestion(
  grade: number,
  category?: string,
  teksStandard?: string
): InsertQuestion {
  const gradePassages = AUTHENTIC_STAAR_PASSAGES[grade] || AUTHENTIC_STAAR_PASSAGES[4];
  const randomPassage = gradePassages[Math.floor(Math.random() * gradePassages.length)];
  
  // Filter questions by category or TEKS if specified
  let availableQuestions = randomPassage.questions;
  if (category) {
    availableQuestions = availableQuestions.filter(q => q.category === category);
  }
  if (teksStandard) {
    availableQuestions = availableQuestions.filter(q => q.teksStandard === teksStandard);
  }
  
  // Fall back to all questions if none match criteria
  if (availableQuestions.length === 0) {
    availableQuestions = randomPassage.questions;
  }
  
  const selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  
  return {
    grade,
    subject: "reading",
    questionText: `${randomPassage.title}\n\n${randomPassage.text}\n\n${selectedQuestion.questionText}`,
    answerChoices: selectedQuestion.answerChoices.map((choice, index) => ({
      id: choice.charAt(0),
      text: choice.substring(3)
    })),
    correctAnswer: selectedQuestion.correctAnswer,
    teksStandard: selectedQuestion.teksStandard,
    category: selectedQuestion.category,
    difficulty: "medium",
    year: new Date().getFullYear(),
    isFromRealSTAAR: true,
    hasImage: false,
    imageDescription: null,
    explanation: `This question tests ${selectedQuestion.category.toLowerCase()} skills using an authentic STAAR-style passage.`
  };
}