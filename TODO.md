# Features

## F1: Celestial North Pole

### US1.1: Point to Celestial North Today from Anywhere

As a user, I want to point to celestial north from a geoposition and the current time and date.

#### Acceptance Criteria
- Given a latitude and longtitude, return an accurate azimuth and elevation that points to celestial north.

#### Tasks
- Determine appropriate unit testing framework for JS.
- Unit test with known lat/lon.
- Write celestial north from lat/lon calculation (assumes current epoch).
- Write a UI for inputting lat/lon.
- Write GPS integration to auto-populate lat/lon.

### US1.2: Point to Celestial North Anytime, Anywhere

As a user, I want to point to celestial north from any arbitrary geoposition and any time & date within +-X years from 2000.

#### Acceptance Criteria
- Given a latitude, longitude, and a datetime within the acceptable range, return an accurate azimuth and elevation that points to celestial north.

## F2: Ecliptic / Orbital North Pole

### US2.1: Point to Orbital North Today from Anywhere

As a user, I want to point to orbital north from a geoposition and the current time and date.

#### Acceptance Criteria
- Given a lat/lon, return an accurate azimuth and elevation pointing to the orbital north pole.

### US2.2: Point to Orbital North Anytime, Anywhere

As a user, I want to point to orbital north from any geoposition and any time & date within +-X years from 2000.

#### Acceptance Criteria
- Given a lat/lon and datetime within the acceptable range, return an accurate azimuth and elevation that points to orbital north.

## F3: Pointing Visualization

### US3.1: Real-time Pointing Feedback

As a user, I want to see visual directions and real-time feedback when I follow the directions to point to celestial north so that the process is easier.

#### Acceptance Criteria
- A user should be able to clearly see what direction they should orient themselves.
- A user should be able to clearly see how high above or below the horizon they should point.
- As the user turns and changes their pointing elevation, the app should update the visual feedback.

---


- Task: Write an application to calculate how someone can point to celestial north from wherever/whenever they are.
- Time expectation: Spend approximately 2-4 hours on this. If you hit 8, you've gone too far for what we're looking for. If you feel inspired to really run with this - go for it! (We have no such expectations.)
- Language: Your choice - you sounded interested in using PHP 7.x, but that's not a requirement.
- Why this:
   - We're looking to see how you'd architect a small application now, especially having seen some of your code from Past Matt.
   - This may involve some kind of API/library integration.
   - This will involve implementing some mathematical calculations.
   - If you want, this could have a data visualization component.