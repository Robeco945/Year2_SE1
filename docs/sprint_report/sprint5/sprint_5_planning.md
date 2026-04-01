# Sprint Planning — Sprint 5

## Sprint Goal

The goal of Sprint 5 is to set up the architecture and implement user interface localization. 

The sprint will focus on transitioning the application from static, hardcoded strings into dynamic localization calls to support our current languages and establish a scalable foundation for future languages.

---

## Planned User Stories / Tasks

During Sprint 5, the team will focus on completing the following user stories and tasks:
- Externalize all static UI texts across the frontend application
- Design and implement a functional language selector in the UI
- Add and integrate full translations for 2 non-Latin languages (Arabic and Japanese)
- Ensure proper UI adjustments and layout support for Right-to-Left (RTL) languages

---

## Key Focus Areas / Expected Outcomes

- **Solid Architecture:** Establish a robust localization framework that makes adding new languages in the future seamless.
- **UI Stability:** Ensure that changing languages (especially to RTL formats) does not introduce bugs, text overflow, or interface errors.
- **Full Coverage:** Guarantee that all user-facing text is routed through the new localization system.

---

## Known Risks & Challenges

- Adapting the existing frontend layout to smoothly support Right-to-Left (RTL) reading directions without breaking component alignments.
- Ensuring backend tests and configurations correctly handle the new non-Latin character sets.

---

## Future Considerations (Sprint 6+)

- Updating the database schema to support dynamic, user-generated multilingual content.
                      |