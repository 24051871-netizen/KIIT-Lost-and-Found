# UML Diagrams: KIIT-Find Campus Portal

---

## 1. Use Case Diagram

```mermaid
flowchart LR
    StudentFinder["Student (Finder)"]
    StudentClaimant["Student (Claimant)"]
    SecurityStaff["Campus Security / Caretaker"]
    Admin["System Admin"]

    subgraph Portal ["KIIT-Find Boundary"]
        UC1["Sign In via @kiit.ac.in OAuth"]
        UC2["Post Lost / Found Item"]
        UC3["Set Double-Blind Verification Challenge"]
        UC4["Search & Filter by Campus / Hostel"]
        UC5["Submit Ownership Claim"]
        UC6["Review Claim & Issue QR Pass"]
        UC7["Scan Handover QR Code"]
        UC8["Audit Trail & Metric Logging"]
    end

    StudentFinder --> UC1
    StudentFinder --> UC2
    StudentFinder --> UC3
    StudentFinder --> UC6

    StudentClaimant --> UC1
    StudentClaimant --> UC4
    StudentClaimant --> UC5

    SecurityStaff --> UC1
    SecurityStaff --> UC7
    SecurityStaff --> UC8

    Admin --> UC8
```

---

## 2. Sequence Diagram: Claim & Handover Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Finder as Student (Finder)
    actor Claimant as Student (Claimant)
    participant Web as Next.js Client
    participant API as Next.js API / Vercel
    participant DB as MongoDB Atlas
    actor Guard as Security Desk

    Finder->>Web: Post found item (e.g., Campus 15)
    Finder->>Web: Provide secret challenge question
    Web->>API: POST /api/items
    API->>DB: Save item with hashed challenge
    DB-->>Web: Item published (ACTIVE)

    Claimant->>Web: Browse items, selects matching item
    Claimant->>Web: Submits answer to challenge
    Web->>API: POST /api/items/:id/claim
    API->>DB: Record claim (CLAIM_PENDING)

    Finder->>Web: Reviews claim answer & approves
    Web->>API: POST /api/items/:id/verify-claim
    API->>API: Generate HMAC-SHA256 Signed QR
    API->>DB: Update item status (CLAIM_APPROVED)
    API-->>Claimant: Deliver Dynamic Handover QR

    Claimant->>Guard: Present QR code at Campus 15 Gate
    Guard->>Web: Scan QR via Camera (or token input)
    Web->>API: POST /api/items/:id/handover
    API->>API: Verify cryptographic signature & expiration
    API->>DB: Update status to RETURNED & log audit
    API-->>Guard: Handover Confirmed!
```

---

## 3. State Machine Diagram: Item Lifecycle

```mermaid
stateDiagram-v2
    [*] --> ACTIVE: Item Reported (Lost/Found)
    ACTIVE --> CLAIM_PENDING: Claimant submits verification answer
    CLAIM_PENDING --> ACTIVE: Finder rejects claim
    CLAIM_PENDING --> CLAIM_APPROVED: Challenge answer verified & QR issued
    CLAIM_APPROVED --> RETURNED: QR scanned & verified at handover point
    RETURNED --> ARCHIVED: Closed & archived
    ARCHIVED --> [*]
```

---

## 4. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ITEM : "reports"
    USER ||--o{ CLAIM : "submits"
    ITEM ||--o{ CLAIM : "contains"
    ITEM ||--o{ AUDIT_LOG : "tracked by"

    USER {
        string email PK "Must end with @kiit.ac.in"
        string name
        string rollNumber
        string hostel
        string role "STUDENT | SECURITY | ADMIN"
        int karmaPoints
    }

    ITEM {
        string id PK
        string title
        string description
        string itemType "LOST | FOUND"
        string category
        string campusId
        string specificLocation
        string[] imageUrls
        string status "ACTIVE | CLAIM_PENDING | CLAIM_APPROVED | RETURNED"
        string secretChallengeQuestion
        string secretAnswerHash
        string contactEmail
    }

    CLAIM {
        string id PK
        string itemId FK
        string claimantEmail
        string challengeAnswer
        string status "PENDING | APPROVED | REJECTED | COMPLETED"
        string qrToken
    }

    AUDIT_LOG {
        string id PK
        string itemId FK
        string action
        string performedByEmail
        datetime timestamp
    }
```
