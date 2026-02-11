package com.careergate.compatibility.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.stereotype.Service;

@Service
public class AiService {

  private final ChatClient chatClient;

  public AiService(ChatClient.Builder chatClientBuilder) {
    this.chatClient = chatClientBuilder
        .defaultAdvisors(new SimpleLoggerAdvisor())
        .build();
  }

  public String generateRoadmap(String analysisSummary, String skillGapsJson) {
    String userPrompt = """
        Based on the following AI analysis summary and skill gap identification, generate a comprehensive learning roadmap.

        CRITICAL KNOWLEDGE BASE (Use these EXACT IDs for these specific topics):
        - Java (The core language): UmnCZ7-9yDY, vLqL40b3s9U
        - JavaScript (Web language): W6NZfCO5SIk, rfscVS0vtbw (JS for beginners)
        - Python: _uQrJ0TkZlc, rfscVS0vtbw
        - React: bMknfKXLgFA, T_S7GBJgE1c
        - Spring Boot: 9ptm2c5Fk5U, 9z_fS1jT77k
        - PostgreSQL: qw--VwXb71Q, o0i1-aB-aGk
        - Docker: pTJxdL_pIWM, i9bK2-g1nQ4
        - Kubernetes: X48VuDVv0do, Wfz3_dIAh4M
        - AWS: f1c24P3bO2E, 0k5LpD1j31Y
        - System Design: ZgdS0EUasK0, 66ieVpgS3F0

        STRICT RULES:
        1. NEVER give a 'Java' video for a 'JavaScript' topic. They are COMPLETELY different.
        2. youtubeVideoId: You MUST provide an 11-character YouTube video ID.
           - STICK TO THE KNOWLEDGE BASE ABOVE. Use the specific ID for the correct topic.
           - If a topic is not in the list, use an ID from a verified educational channel (freeCodeCamp, Mosh, Traversy).
           - NEVER invent or guess IDs. If you don't have a REAL 11-char ID, leave it empty.

        3. youtubeSearchQuery: Provide a specific search string that will yield the best results for this topic.
           - Formatted as: "[Topic Name] tutorial complete guide [Preferred Channel]"

        4. articleLinks: Provide 2-3 real, working URLs to official documentation or top-tier technical articles.
           - PRIORITY: Official docs (docs.python.org, react.dev, spring.io, developer.mozilla.org).

        JSON Structure Requirements:
        - Root: "weeks" (array)
        - Week: "weekNo", "days" (array)
        - Day: "dayNo", "title", "description", "youtubeVideoId", "youtubeSearchQuery", "articleLinks" (array)

        Analysis Summary: {summary}
        Skill Gaps: {gaps}

        Return ONLY valid JSON. Accuracy and correct topic-to-video mapping is MANDATORY.
        """;

    String content = chatClient.prompt()
        .user(u -> u.text(userPrompt)
            .param("summary", analysisSummary)
            .param("gaps", skillGapsJson))
        .call()
        .content();

    return cleanJsonResponse(content);
  }

  private String cleanJsonResponse(String content) {
    if (content != null && content.contains("```json")) {
      content = content.substring(content.indexOf("```json") + 7);
      content = content.substring(0, content.lastIndexOf("```"));
    } else if (content != null && content.contains("```")) {
      content = content.substring(content.indexOf("```") + 3);
      content = content.substring(0, content.lastIndexOf("```"));
    }
    return content != null ? content.trim() : null;
  }

  public String analyzeResume(String resumeText, String jobDescription, String requiredSkills,
      String userSkills) {
    String userPrompt = """
        Analyze the following resume against the job description and the list of required skills.
        Also consider the user's self-reported skills and ratings provided in the context.

        Provide actionable 'improvementSuggestions' limited to EXACTLY 2-3 lines (around 30-40 words).

        STRICT GAP FILTERING:
        Only include a skill in 'skillGaps' if 'userRating' is STRICTLY LESS than 'requiredRating'.
        If userRating >= requiredRating, do NOT include it as a gap.

        Provide a JSON response containing:
        - compatibilityScore (0-100)
        - skillMatchScore (0-100)
        - experienceScore (0-100)
        - resumeScore (0-100)
        - analysisSummary (text in 2nd person)
        - skillGaps (list of objects with:
            - skillName
            - gapLevel (1-5, where 5 is a critical gap)
            - requiredRating (1-5 estimate based on job)
            - userRating (1-5 based on resume/context)
            - improvementSuggestions (descriptive text)
          )

        Ensure the response is a valid JSON.

        Resume: {resume}
        Job Description: {jobDescription}
        Job Required Skills & Ratings: {requiredSkills}
        User Reported Skills & Ratings: {userSkills}
        """;

    String content = chatClient.prompt()
        .user(u -> u.text(userPrompt)
            .param("resume", resumeText)
            .param("jobDescription", jobDescription)
            .param("requiredSkills", requiredSkills.toString())
            .param("userSkills", userSkills))
        .call()
        .content();

    return cleanJsonResponse(content);
  }
}
