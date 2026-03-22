# FlyAirways Project Tasks

## Phase 3: Relational Database Migration (PostgreSQL)
- [x] Update docker-compose and NestJS dependencies for PostgreSQL and TypeORM
- [x] Convert Mongoose Schemas to TypeORM Entities (User, Flight, Booking)
- [x] Refactor Auth, Flight, and Booking services for Relational data fetching
- [x] Update frontend models from MongoDB strings `_id` to standard `id`

## Phase 4: Autocomplete Feature Polish
- [x] Update locations backend API to accept & filter upon query params (`>= 3 chars`)
- [x] Integrate RxJS `Subject` and `debounceTime` into input elements for real-time querying without UI locking
- [x] Attach final payload directly to flight `submitSearch` to ensure backend validation
