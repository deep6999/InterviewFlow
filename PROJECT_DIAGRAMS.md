# InterviewFlow System Diagrams

This document contains Mermaid code for the main structural and behavioral diagrams of the `InterviewFlow` project based on the current frontend and backend codebase.

## 1. Class Diagram

```mermaid
classDiagram
    direction LR

    class User {
      +ObjectId _id
      +String name
      +String email
      +String profileImage
      +String clerkId
      +Date createdAt
      +Date updatedAt
    }

    class Session {
      +ObjectId _id
      +String problem
      +String difficulty
      +ObjectId host
      +ObjectId participant
      +String status
      +String callId
      +Date createdAt
      +Date updatedAt
    }

    class SessionController {
      +createSession(req,res)
      +getActiveSession(req,res)
      +getMyRecentSessions(req,res)
      +getSessionById(req,res)
      +joinSession(req,res)
      +endSession(req,res)
    }

    class ChatController {
      +getStreamToken(req,res)
    }

    class CodeController {
      +executeCode(req,res)
    }

    class ProtectRoute {
      +requireAuth()
      +attachUser(req,res,next)
    }

    class SessionApi {
      +createSession(data)
      +getActiveSessions()
      +getMyRecentSessions()
      +getSessionById(id)
      +joinSession(id)
      +endSession(id)
      +getStreamToken()
    }

    class UseSessionsHooks {
      +useCreateSession()
      +useActiveSessions()
      +useMyRecentSessions()
      +useSessionById(id)
      +useJoinSession()
      +useEndSession()
    }

    class DashboardPage {
      +handleCreateRoom()
      +isUserInSession(session)
    }

    class SessionPage {
      +handleRunCode()
      +handleEndSession()
      +handleLanguageChange(e)
    }

    class ProblemPage {
      +handleRunCode()
      +handleProblemChange(id)
      +handleLanguageChange(e)
      +checkIfTestsPassed(actual, expected)
    }

    class UseStreamClient {
      +cleanupConnections()
      +leaveSessionCall()
    }

    class StreamService {
      +upsertStreamUser(userData)
      +deleteStreamUser(userId)
      +createToken(clerkId)
      +createVideoCall(callId)
      +createChatChannel(callId)
    }

    class OnlineCompilerService {
      +runCode(language, code, input)
    }

    class ClerkAuth {
      +requireAuth()
      +getAuth(req)
    }

    class MongoDB {
      +users collection
      +sessions collection
    }

    User "1" <-- "0..*" Session : host
    User "1" <-- "0..*" Session : participant

    SessionController --> Session : manages
    SessionController --> StreamService : creates/deletes call+chat
    ChatController --> StreamService : generates token
    CodeController --> OnlineCompilerService : invokes
    ProtectRoute --> ClerkAuth : validates
    ProtectRoute --> User : loads

    SessionApi --> SessionController : calls REST endpoints
    SessionApi --> ChatController : calls token endpoint

    UseSessionsHooks --> SessionApi : wraps
    DashboardPage --> UseSessionsHooks : uses
    SessionPage --> UseSessionsHooks : uses
    SessionPage --> UseStreamClient : uses
    SessionPage --> OnlineCompilerService : execute via API
    ProblemPage --> OnlineCompilerService : execute via API

    UseStreamClient --> SessionApi : requests token
    UseStreamClient --> StreamService : connects to Stream

    User --> MongoDB : persisted in
    Session --> MongoDB : persisted in
```

## 2. ER Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string profileImage
        string clerkId UK
        date createdAt
        date updatedAt
    }

    SESSION {
        ObjectId _id PK
        string problem
        string difficulty
        ObjectId host FK
        ObjectId participant FK
        string status
        string callId
        date createdAt
        date updatedAt
    }

    USER ||--o{ SESSION : hosts
    USER ||--o{ SESSION : participates_in
```

## 3. Sequence Diagram

The sequence below shows the main collaborative session lifecycle: create session, join session, initialize Stream, and end session.

```mermaid
sequenceDiagram
    autonumber
    actor Host as Host User
    actor Participant as Participant User
    participant UI as Frontend UI
    participant API as Express API
    participant Auth as Clerk
    participant DB as MongoDB
    participant Stream as Stream Video/Chat
    participant Compiler as OnlineCompiler

    Host->>UI: Create session(problem, difficulty)
    UI->>API: POST /api/sessions
    API->>Auth: Validate token via protectRoute
    Auth-->>API: clerkId
    API->>DB: Create Session(host, problem, difficulty, callId)
    DB-->>API: session
    API->>Stream: Create video call(callId)
    API->>Stream: Create chat channel(callId)
    Stream-->>API: resources created
    API-->>UI: session details
    UI-->>Host: Navigate to /session/:id

    Participant->>UI: Open active session
    UI->>API: GET /api/sessions/:id
    API->>Auth: Validate token
    API->>DB: Load session + populate host/participant
    DB-->>API: session
    API-->>UI: session details

    UI->>API: POST /api/sessions/:id/join
    API->>Auth: Validate token
    API->>DB: Check session rules and save participant
    API->>Stream: Add participant to chat channel
    Stream-->>API: member added
    API-->>UI: joined session

    par Host stream init
      UI->>API: GET /api/chat/token
      API->>Auth: Validate token
      API->>Stream: Create user token
      Stream-->>API: stream token
      API-->>UI: token + profile
      UI->>Stream: Join video call(callId)
      UI->>Stream: Connect chat user and watch channel
    and Participant stream init
      UI->>API: GET /api/chat/token
      API->>Auth: Validate token
      API->>Stream: Create user token
      Stream-->>API: stream token
      API-->>UI: token + profile
      UI->>Stream: Join video call(callId)
      UI->>Stream: Connect chat user and watch channel
    end

    Host->>UI: Run code
    UI->>API: POST /api/code/execute
    API->>Compiler: Run code for selected language
    Compiler-->>API: output/error/status
    API-->>UI: execution result

    Host->>UI: End session
    UI->>API: POST /api/sessions/:id/end
    API->>Auth: Validate token
    API->>DB: Verify host and load session
    API->>Stream: Delete video call
    API->>Stream: Delete chat channel
    API->>DB: Update session status=completed
    API-->>UI: session completed
    UI-->>Host: Navigate to dashboard
    UI-->>Participant: Poll detects completed session and redirects
```

## 4. Activity Diagram

```mermaid
flowchart TD
    A([User enters app]) --> B{Signed in?}
    B -- No --> C[View Home Page]
    C --> D[Sign in with Clerk]
    D --> E[Open Dashboard]
    B -- Yes --> E[Open Dashboard]

    E --> F{Choose action}
    F --> G[Create new session]
    F --> H[Join active session]
    F --> I[Practice standalone problem]

    G --> J[Enter problem and difficulty]
    J --> K[Backend creates session record]
    K --> L[Backend creates Stream video call and chat channel]
    L --> M[Navigate host to session room]

    H --> N[Open selected session]
    N --> O{User is host or participant already?}
    O -- No --> P[Join session as participant]
    O -- Yes --> Q[Stay in session]
    P --> Q

    M --> Q
    Q --> R[Initialize Stream client]
    R --> S[Fetch Stream token]
    S --> T[Join video call and chat]
    T --> U[Collaborate on coding problem]
    U --> V{Run code?}
    V -- Yes --> W[Send code to backend]
    W --> X[Backend calls Online Compiler]
    X --> Y[Show output or error]
    Y --> U
    V -- No --> Z{End or leave session?}

    Z -- Host ends --> AA[Delete Stream resources and mark session completed]
    Z -- Participant leaves --> AB[Disconnect local Stream client]
    Z -- Continue --> U

    AA --> AC[Redirect users to dashboard]
    AB --> AC

    I --> AD[Open problem page]
    AD --> AE[Write code]
    AE --> AF[Run code through backend compiler API]
    AF --> AG{Matches expected output?}
    AG -- Yes --> AH[Show accepted result]
    AG -- No --> AI[Show wrong answer or execution error]
```

## 5. Use Case Diagram

Mermaid does not have native UML use-case notation, so the use-case diagram is represented with a flowchart-style UML approximation.

```mermaid
flowchart LR
    Host[Host User]
    Participant[Participant User]
    Guest[Guest / Unauthenticated User]
    AdminService[External Auth and Realtime Services]

    subgraph InterviewFlow["InterviewFlow System"]
      UC1([Sign In])
      UC2([Browse Problems])
      UC3([Solve Practice Problem])
      UC4([Create Session])
      UC5([View Active Sessions])
      UC6([Join Session])
      UC7([Participate in Video Call])
      UC8([Chat in Session])
      UC9([Run Code])
      UC10([View Recent Sessions])
      UC11([End Session])
      UC12([Receive Stream Token])
    end

    Guest --> UC1
    Guest --> UC2

    Host --> UC2
    Host --> UC3
    Host --> UC4
    Host --> UC5
    Host --> UC7
    Host --> UC8
    Host --> UC9
    Host --> UC10
    Host --> UC11
    Host --> UC12

    Participant --> UC2
    Participant --> UC3
    Participant --> UC5
    Participant --> UC6
    Participant --> UC7
    Participant --> UC8
    Participant --> UC9
    Participant --> UC10
    Participant --> UC12

    UC4 -. includes .-> UC12
    UC6 -. includes .-> UC12
    UC7 -. includes .-> UC8
    UC3 -. includes .-> UC9

    AdminService --> UC1
    AdminService --> UC12
    AdminService --> UC7
    AdminService --> UC8
```

## 6. Context Level Diagram

This is the context-level DFD (Level 0), showing `InterviewFlow` as one process interacting with external entities.

```mermaid
flowchart LR
    User[User<br/>Host or Participant]
    Clerk[Clerk Authentication]
    Stream[Stream Video and Chat]
    Compiler[OnlineCompiler API]
    Mongo[(MongoDB)]

    System((InterviewFlow System))

    User -->|Sign in, create session, join session, run code| System
    System -->|Pages, session data, execution results| User

    System -->|Auth validation requests| Clerk
    Clerk -->|Authenticated clerkId and session context| System

    System -->|Create token, call, chat channel, membership updates| Stream
    Stream -->|Realtime video/chat access| System

    System -->|Code execution request| Compiler
    Compiler -->|Output, status, errors| System

    System -->|Create/read/update users and sessions| Mongo
    Mongo -->|Persistent data| System
```

## 7. First Level Diagram

This is the Level 1 DFD, decomposing `InterviewFlow System` into major internal processes.

```mermaid
flowchart LR
    User[User]
    Clerk[Clerk]
    Stream[Stream]
    Compiler[OnlineCompiler API]

    D1[(Users Collection)]
    D2[(Sessions Collection)]

    P1((1.0 Authentication and User Resolution))
    P2((2.0 Session Management))
    P3((3.0 Realtime Collaboration))
    P4((4.0 Code Execution))
    P5((5.0 Practice Problem Interface))

    User -->|Login/session token| P1
    P1 -->|Validate token| Clerk
    Clerk -->|clerkId| P1
    P1 -->|Load user by clerkId| D1
    D1 -->|user profile| P1
    P1 -->|authorized user context| P2
    P1 -->|authorized user context| P3
    P1 -->|authorized user context| P5

    User -->|Create, join, end, list sessions| P2
    P2 -->|Create/read/update session| D2
    D2 -->|session records| P2
    P2 -->|Session details/status| User
    P2 -->|callId, membership events| P3

    User -->|Join call, open chat| P3
    P3 -->|Token generation, call/channel actions| Stream
    Stream -->|Token, call state, chat state| P3
    P3 -->|Realtime collaboration access| User

    User -->|Run interview code| P4
    P4 -->|Execute source code| Compiler
    Compiler -->|Output/error/status| P4
    P4 -->|Execution result| User

    User -->|Browse and solve problems| P5
    P5 -->|Run practice code| P4
    P5 -->|Problem content and verdict| User
```

## Notes

- `User` and `Session` are the two persisted MongoDB entities in the current codebase.
- Problem metadata is currently stored in frontend static data, so it appears in flows and pages but not in the ERD as a database entity.
- The use-case and DFD-style diagrams are expressed with Mermaid flowcharts because Mermaid does not provide a full native UML use-case renderer.
