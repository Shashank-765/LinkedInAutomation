import OpenAI from "openai";


export class AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true 
    });
  }

  /**
   * Suggest LinkedIn Topics (same output behavior)
   */
  async suggestTopics(
    industry: string,
    company: string,
    postType: string
  ): Promise<string[]> {
    const prompt = `Act as a LinkedIn growth expert for the ${industry} industry.
Suggest 5 highly engaging, viral topic ideas for a company called "${company}".
The posts should be designed as "${postType}" content.
Return only the list of 5 topics separated by new lines, no numbers or bullets.`;

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: "You are a LinkedIn growth expert." },
          { role: "user", content: prompt },
        ],
      });

      const text = response.choices[0].message.content || "";

      return text
        .split("\n")
        .filter((t) => t.trim().length > 0)
        .map((t) => t.replace(/^\d+\.\s*/, "").trim())
        .slice(0, 5);
    } catch (error) {
      console.error("Topic Suggestion Error:", error);
      return [
        `Future trends in ${industry}`,
        `Solving common ${industry} challenges`,
        `How ${company} is disrupting the market`,
        `Top 3 mistakes in ${industry} today`,
        `The secret to success in ${industry}`,
      ];
    }
  }

/**
 * Generate LinkedIn Post (EXACT old behavior preserved)
 */
async generateLinkedInPost(
        topic: string,
        tone: string = "neutral", // kept for compatibility, not enforced
        userProfile: any
      ): Promise<string> {
                const { companyName, industry, postTypePreference } = userProfile;

              const prompt = `
            Topic: ${topic}

            Act as a world-class LinkedIn Content Strategist specializing in ${industry}.
                        Write a viral-style post for "${companyName}".

                        POST PARAMETERS:
                        - Topic: ${topic}
                        - Core Objective: ${postTypePreference}
                        - Desired Tone: ${tone}

                        
            Step 1 — Internally classify the topic into one of these types:
            - Person (founder, leader, public figure)
            - Company or Product
            - Technology or Trend
            - Concept or Skill
            - Event or News

            Step 2 — Adapt the writing based on the type:
            - If Person → focus on journey, early struggles, decisions, mindset.
            - If Company/Product → focus on origin, problem solved, why it matters.
            - If Technology/Trend → focus on what changed, why now, future impact.
            - If Concept/Skill → focus on why it's important, how it helps, how to apply.
            - If Event/News → focus on what happened, why it matters, what we learn.

            Step 3 — Write a LinkedIn post that is specific to THIS topic, not generic.

            Step 4 — Add a human layer:
            - Subtly connect the topic to common feelings: confusion, ambition, fear of starting, slow progress, discipline, uncertainty, or learning curves.
            - Make the reader feel “this applies to me” without saying it explicitly.
            - The tone should feel supportive, grounded, and realistic — not motivational, not hype.

            Strict requirements:
            - Mention at least 2 concrete, topic-specific facts or examples.
            - Avoid vague phrases like "this shows that hard work matters".
            - No generic motivational language.
            - Be precise, thoughtful, and relevant.

            Generate a LinkedIn post with:
            - One strong heading
            - 2 short narrative paragraphs (not long)
            - 3–4 practical lessons or insights derived from the topic
            - A thoughtful, slightly human closing line (reflective, not inspirational)

            Formatting rules (STRICT):
            - Do NOT use asterisks (*)
            - Do NOT use bold text
            - Do NOT use markdown
            - Bullet points must start with a dash (-) only
            - Hashtags must be in the last line only
            - Simple, clean English
            - Output only the final content
            `;

              try {
                const response = await this.client.chat.completions.create({
                  model: "gpt-4o-mini",
                  temperature: 0.6, // SAME as old function
                  messages: [
                    {
                      role: "system",
                      content: `
            You are a topic-aware research writer for LinkedIn.

            Your job:
            - Understand the topic deeply before writing.
            - Adapt tone, angle, and structure to the topic type.
            - Use concrete facts and context.
            - Avoid generic inspiration.

            Style:
            - Clear
            - Insightful
            - Human
            - Specific

            Never:
            - Use emojis
            - Use markdown
            - Use hype language
            - Use generic life advice

            Always:
            - Be grounded in the topic
            - Be useful to builders, founders, and young professionals
            - Output only the final content
            `
                    },
                    { role: "user", content: prompt }
                  ]
                });

    return response.choices[0].message.content?.trim() || "Failed to generate content.";
  } catch (error) {
    console.error("Post Generation Error:", error);
    throw error;
  }
}


 /**
 * Generate Image for LinkedIn Post (Topic-Accurate)
 */
async generateImagesForPost(
          topic: string,
          industry: string,
          count: number = 1
        ): Promise<string[]> {

          const prompt = `
        Create a realistic, professional LinkedIn feed image.

        VISUAL GOAL:
        Represent the idea of: "${topic}"

        INDUSTRY CONTEXT:
        ${industry}

        IMAGE REQUIREMENTS (STRICT):
        - Single clear scene, not abstract
        - Realistic corporate or work environment
        - Visual elements must clearly relate to the topic
        - Industry-specific objects, tools, or settings
        - Human presence allowed only if relevant (natural, candid)
        - No fantasy, no surrealism, no exaggeration
        - No charts, no diagrams, no text, no words
        - No logos, no branding

        STYLE:
        - Clean editorial photography (NOT illustration)
        - Natural lighting
        - Neutral professional color palette
        - Sharp focus, modern camera look
        - Looks like a real photo taken for a business article

        COMPOSITION:
        - One main subject
        - Minimal background clutter
        - Suitable for LinkedIn feed
        - Aspect ratio 16:9
        `;

          try {
            const response = await this.client.images.generate({
              model: "dall-e-3",
              prompt,
              size: "1792x1024",
              quality: "standard",
            });

            return response.data.map(img => img.url);
          } catch (error) {
            console.error("Image Generation Error:", error);

            // Fallback
            return Array.from({ length: count }, (_, i) =>
              `https://picsum.photos/seed/${encodeURIComponent(topic)}-${i}/1200/675`
            );
          }
}

}

export const aiService = new AIService();
