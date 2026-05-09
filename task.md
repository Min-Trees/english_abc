You are a senior backend + frontend developer.

I already have an English learning system built with Spring Boot (backend) and React (frontend).
Your task is to EXTEND the system by adding new features.

IMPORTANT RULES:

* DO NOT create new database entities unless absolutely necessary
* DO NOT modify existing database schema
* Reuse existing models, tables, and relationships
* Focus on business logic, APIs, and UI behavior
* Follow clean architecture: Controller → Service → Repository
* Use RESTful APIs
* Use DTO if needed but DO NOT change entities

---

# 1. COURSE DETAIL PAGE

## Requirements:

* Create a course detail page
* Display:

  * Course information
  * List of lessons (ordered)
  * Each lesson includes:

    * Learning materials (video, pdf, text)
    * Exercises
    * Tests

## Behavior:

* When user clicks a lesson:

  * Show lesson content
  * Show related exercises and tests
* When user completes a lesson:

  * Update learning progress
* Allow navigation:

  * Next lesson
  * Previous lesson

---

# 2. VOCABULARY + FLASHCARD

## Requirements:

* Add vocabulary learning feature
* Display list of vocabulary words
* Allow user to:

  * Save vocabulary
  * Review saved words

## Flashcard mode:

* Show word on front
* Show meaning + example on back
* Allow:

  * Next card
  * Mark as remembered / not remembered

## Behavior:

* If user answers incorrectly in exercises:
  → Suggest adding that word to vocabulary list

---

# 3. DASHBOARD

## Requirements:

* Create dashboard page

## Display:

* Number of lessons completed today
* Number of exercises done
* Accuracy (% correct answers)
* Learning streak (days)

## Behavior:

* Data is calculated based on user activity
* Filter by current day

---

# 4. EXERCISE SYSTEM (EXTENSION)

## Supported types:

* Multiple choice
* Essay
* Drag & drop
* Speaking
* Writing

## Submission:

* When user submits:

  * If objective (multiple choice, drag drop):
    → Auto grade in backend
  * If subjective (essay, writing, speaking):
    → Send to AI (Groq API) for grading

## AI Grading:

* Send:

  * Question
  * User answer
* Receive:

  * Score (0–10)
  * Feedback

## Display:

* Show score + feedback to user

---

# 5. LEADERBOARD / RANKING

## Requirements:

* Create leaderboard page

## Ranking types:

* Daily activity
* High score
* Contest ranking

## Behavior:

* Rank users based on:

  * Number of lessons completed
  * Exercise scores
  * Participation

---

# 6. TEACHER FEATURES

## Requirements:

* Teachers can:

  * Create lessons
  * Create exercises
  * View student submissions
  * Grade manually

## AI Support:

* Allow teacher to generate exercises using AI
* Input:

  * Lesson content OR prompt
* Output:

  * Generated questions

## Workflow:

* Teacher creates content
  → Submit for admin approval
  → Admin approves → content becomes visible

---

# 7. ADMIN FEATURES

## Requirements:

* Admin dashboard

## Features:

* Approve/reject lessons created by teachers
* Manage users
* Manage courses
* Moderate content

---

# 8. FORUM (STACKOVERFLOW STYLE)

## Requirements:

* Create discussion forum

## Features:

* Create post (question)
* Comment / answer
* Upvote
* Mark accepted answer

## Behavior:

* Sort by:

  * Newest
  * Most upvoted

---

# 9. GENERAL REQUIREMENTS

## Backend:

* Spring Boot
* REST API
* Service layer handles business logic
* Use existing authentication system (JWT)

## Frontend:

* React
* Component-based structure
* Pages:

  * Course Detail
  * Dashboard
  * Vocabulary
  * Leaderboard
  * Forum

## UX:

* Clean UI
* Easy navigation
* Responsive

---

# OUTPUT EXPECTATION

Generate:

* Controller logic
* Service logic
* API endpoints
* Frontend components (React)
* API integration

DO NOT:

* Create new database schema
* Modify existing entities

Focus on:

* Feature implementation
* Clean and maintainable code
