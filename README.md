# Event Check-in API (NestJS + MongoDB)

Endpoints

- GET /tickets → all tickets
- POST /checkin → { ticketReferenceNumber, method: "qr"|"manual" }
  - 200 OK → checkedIn=true, checkedInAt set
  - 404 → ticket not found
  - 409 → already checked in (duplicate prevented)
- GET /admin/stats → { total, checkedIn, perType, recent[] }

Run

1. cp .env.example .env (fill MONGODB_URI)
2. npm i
3. npm run seed # 15 tickets: 5 VIP / 5 Standard / 5 Student
4. npm run start:dev

Design notes

- MongoDB Atlas for speed & flexibility; Mongoose schema `Ticket` holds status + timestamp.
- Idempotent check-in (409 on repeat).
- Simple REST fits MVP and is easy to extend (auth, exports, logs).
