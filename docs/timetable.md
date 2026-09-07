# Timetable Engine & Multi-Dimensional Conflict Detection

## The Conflict Detection Engine (`lib/timetable-engine.ts`)

The scheduling engine performs multi-dimensional validation against both the proposed period batch and active university published schedules:

1. **Teacher Conflict**:
   Flags an error if an instructor is scheduled for multiple sections or rooms during the same day and period.
2. **Room Collision**:
   Flags an error if a classroom or laboratory is double-booked by concurrent classes.
3. **Section Concurrency Collision**:
   Flags an error if students of a given section are scheduled for more than one lecture at a time.
4. **Seating Capacity Constraint**:
   Compares `room.capacity` with `section.capacity`. Generates a warning if room seating cannot accommodate the student enrollment count.
5. **Laboratory Requirement Constraint**:
   If a subject has type `LAB`, the engine requires that `room.roomType` equals `LAB`. Theoretical lecture halls are rejected for practical lab sessions.

## Lifecycle & Automatic View Generation

```
   Academic Setup (Subjects, Faculty, Rooms)
                    ↓
         Course & Section Allocation
                    ↓
          Draft Timetable Period Entry
                    ↓
        Algorithmic Conflict Inspection
                    ↓
           HOD / Admin Signoff
                    ↓
          Status: PUBLISHED
                    ↓
 ┌──────────────────┬──────────────────┬──────────────────┐
 Student Timetable  Teacher Timetable  Room Schedule  Department View
```

Once published, students see their section schedule, teachers see their personal teaching timetable, facilities managers see the room schedule, and HODs see the consolidated department view without duplicating data records.
