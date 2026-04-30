# InterviewFlow Presentation Script

## Slide 1 - Title
Good [morning/afternoon], everyone. We are Deepak Chauhan and Prem Aauji, and today we are presenting **InterviewFlow**, a collaborative coding interview platform.  
This project is designed to improve technical interview preparation by bringing coding, communication, and collaboration into one place.  
Instead of using different tools for video calls, code editing, and problem solving, InterviewFlow gives users a unified environment for both solo practice and live mock interviews.

## Slide 2 - What is InterviewFlow?
InterviewFlow is a full-stack web platform built for technical interview preparation.  
It supports two main use cases: individual coding practice and live collaborative mock interviews.  
The idea is simple: users should be able to practice problems, talk to each other, chat, and run code without constantly switching between platforms.  
This makes the preparation process smoother, more focused, and more realistic.

## Slide 3 - Problem Statement
One major problem in interview preparation is fragmentation.  
Candidates usually use one tool for video calls, another for coding, and another for discussing or sharing problems.  
This breaks concentration and reduces the realism of mock interviews.  
Because of that, practice sessions often feel disconnected from actual interview situations.  
InterviewFlow was created to solve this exact problem by offering one integrated end-to-end solution.

## Slide 4 - Proposed Solution
Our solution is to create one platform that combines the entire interview workflow.  
InterviewFlow integrates video calls, chat, coding, code execution, and session management in a single environment.  
Users can create a session, invite or join another participant, discuss the problem in real time, write code, and test it instantly.  
This not only reduces friction, but also makes the mock interview experience much closer to a real technical interview.

## Slide 5 - Objectives
The main objective of this project was to build a seamless mock interview experience.  
We wanted to support real-time collaboration between interviewer and candidate, while also allowing independent coding practice.  
Another important goal was multi-language support, so users can practice in JavaScript, Python, or Java.  
We also wanted session tracking and a deployable product architecture, so the project is not just a prototype but a complete working platform.

## Slide 6 - Key Features
InterviewFlow includes several important features that make the platform practical and user-friendly.  
First, we use **Clerk authentication** for secure sign-in and user management.  
Second, users can create, join, and end interview sessions through a clear session lifecycle.  
Third, we integrated **real-time video and chat** for communication during interviews.  
On top of that, the platform includes a **Monaco code editor** with syntax highlighting and **multi-language code execution**.  
We also included a **solo practice mode** for users who want to improve independently.

## Slide 7 - Methodology / User Journey
The user journey begins with authentication through Clerk.  
After signing in, the user can either choose solo practice mode or create a live session.  
If they create a session, they select a problem and difficulty level. Another user can then join that active session.  
During the session, both users interact through video, chat, and the coding workspace.  
When the code is ready, it is executed through the backend API, and once the interview is complete, the host can end the session.  
This workflow helped us design the project in a user-centered and structured way.

## Slide 8 - System Architecture
InterviewFlow follows a client-server architecture.  
On the frontend, we use a React and Vite single-page application to deliver a fast and modern user experience.  
On the backend, we use Node.js and Express to handle APIs, session logic, authentication flow, and integrations.  
MongoDB with Mongoose manages persistent data such as users and sessions.  
For real-time communication, we integrated Stream Video and Stream Chat, and for code execution, we connected to the OnlineCompiler API.  
The project is deployed on Render, making it accessible as a live web application.

## Slide 9 - Technology Stack
For the frontend, we used **React 19**, **Vite**, **React Router**, and **TanStack Query**.  
For styling, we used **Tailwind CSS** and **DaisyUI** to build a clean and responsive interface.  
The coding experience is powered by **Monaco Editor**, which is the same editor engine used in VS Code.  
On the backend, we used **Node.js** and **Express 5**.  
For data storage, we used **MongoDB with Mongoose**, while **Clerk** handles authentication and **Stream SDK** powers live features.  
This stack allowed us to build a modern, scalable, and industry-relevant project.

## Slide 10 - Data Model / Database
Our database design is centered around two main models: **User** and **Session**.  
The User model stores fields like name, email, profile image, and Clerk ID.  
The Session model stores the interview problem, difficulty, host, participant, status, and call ID used for Stream integration.  
This structure helps us manage the complete session lifecycle, from creation to completion.  
In simple terms, the database keeps track of who is participating, what problem they are solving, and what stage the session is currently in.

## Slide 11 - Challenges and Solutions
This project involved several technical challenges.  
One challenge was integrating multiple third-party services such as Clerk, Stream, and the OnlineCompiler API. We solved this by keeping the backend modular and environment-driven.  
Another challenge was maintaining consistent real-time session state between the database and live communication tools. We handled that through session-based logic and Stream hooks.  
We also needed secure code execution, so the backend acts as a validated proxy instead of exposing the compiler service directly from the frontend.  
Finally, building a responsive interview workspace required a flexible UI, which we solved using Monaco Editor and resizable panels.

## Slide 12 - Future Scope and Enhancements
There are many ways InterviewFlow can be improved in the future.  
We can expand the problem library and organize it by topic, company, or difficulty.  
We also want to add AI-generated interview feedback and performance analytics so users can better understand their strengths and weaknesses.  
Another major improvement would be real-time collaborative code editing with character-level synchronization.  
Features like session recording, scheduling, company-specific interview tracks, and progress leaderboards could make the platform even more valuable.

## Slide 13 - Conclusion / Thank You
To conclude, InterviewFlow is a unified platform for coding interview preparation that combines solo problem solving with live collaborative mock interviews.  
It addresses the real problem of fragmented tools by bringing video, chat, coding, and execution into one workflow.  
Through this project, we applied full-stack development, API integration, authentication, database modeling, and real-time communication in one practical system.  
Thank you for listening. We would be happy to answer any questions.

## Short Closing Line
Thank you. We are now open to questions and feedback.
