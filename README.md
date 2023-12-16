# CS546
Project

FRAP Getting Started
 
Project files (submitted in `FRAP` zip file)
 
1. `.env`: This file contains configuration settings. 
2. `Cs546`: This folder contains the actual project code for FRAP.
 
Prerequisites
 
1. FRAP uses Node.js as the runtime environment.
2. FRAP uses npm to manage dependencies of the application.
 
Installation
 
1. Install dependencies: ‘npm install’
2. Database Setup: Set up MongoDB database by populating it with initial data.
a. Navigate to ‘seed.js’ in the folder “tasks”
b. Run ‘seed.js’
3. Start the application: ‘npm start’. This will launch the FRAP on ‘http://localhost:3000’.
 
Usage
 
1. Home Page Overview: The Home Page, titled “Welcome to Frap”, greets users and introduces them to the FRAP application.
 
2. Navigation for Non-Logged-In Users: Users who are not logged in can explore FRAP on our “About” page, which also includes an introduction to FRAP team. They have the option to register as a Frap member through our “Register” page, read user reviews on the “Reviews” page, or log in via the “Log In” page.
 
3. Registration process for New Users: New Users can register through the “Register” page by filling out the Registration Form. Fields required for completion are marked with asterisks. The “Enable Notifications” field is an option for users who wish to receive email notifications for any activity related to a fraudster they reported.
 
4. Login Functionality: The “Login” page allows returning users to securely log in to the application.
 
5. Feedback Submission for Logged-In Users: Extra feature. Logged-in users can send feedback or inquiries through the “Feedback” page. The feedback form requires text to be 10 to 250 characters in length and composed of at least 80% letters. The Name field accepts only letter characters, and the length must be between 2 to 30 characters.
 
6. Dashboard Access for Logged-In Users: Logged-in users can view Frap statistics on the “Dashboard” page, providing insights into app-wide data and trends.
 
7. Review Writing and Viewing: Extra feature. On the “Reviews” page, logged-in users can both read and write reviews. The form requires the Nickname field to contain only letters and be between 2 to 20 characters long. The review text must be 80% letters and between 10 to 250 characters long.
 
8. Fraud Reporting Mechanism: through the “Report” page, logged-in users can report fraud. The report must include at least one of the following identifiers of the fraudster: Email, EIN, SSN, ITIN, or phone number. Our system identifies whether the reported fraudster already exists in our database or if a new fraudster profile should be created. This sophisticated matching process also allows for the merging of fraudster profiles when overlapping attributes are detected. The Fraud type field is a mandatory entry, where users need to specify the closest description of the fraud type encountered.
 
9. Database Search Capability: Logged-in users can search for fraudsters by name, phone number, SSN, EIN, ITIN, or email. The search results are limited to a maximum of one fraudster for unique identifiers, except for names which may yield multiple results due to the commonality of names. The results are sorted by the most recent activity. Users, who opted for notifications and receive an email with the fraudster’s Id, can search for that specific fraudster on our website.
 
10. Profile Management Options: On the “Profile” page, logged-in users can change their profile details or choose to delete their account permanently from the database.
 
11. Fraud Detection Tool: Extra feature. The “Detect” page offers a unique tool where users can upload a PDF file for AI-based analysis, providing an estimate of the likelihood of the document being fraud-free. This feature extends our app’s fraud detection capabilities beyond our database.
 
12. Logout Functionality: Users can log out of our system at any time using the “Logout” page.
 
13. Direct Contact with developers: Extra feature. If users wish to contact a developer individually, they can do so through the “Contact Us” link at the bottom of the page. This link directs users to a list of developer contacts, and upon selecting developer’s name, they will be redirected to an email form.
 
 
Features:

Core Features: 
User Auth & Registration.
 
Fraud Reporting.
 
Alert System.
   
Badges for frequent and diligent fraud
reporters .
 
Reporting Dashboard.
 
Fraud Search.

Extra Features: 
1.  Fraud Detection.
    
2. Enterprise Plan:  API Integration:
Seamless data exchange and analysis through external system integration.
   
3. Contact us.

5. Simple feedback/question form.
 
 
License
No license
 
Authors/Contributors
 
Pavlo Lashmanov 20016582
Stephen Miller 20017345
Robert Schneider 20010516
Vaiva Vitten 20016211
 
Acknowledgements
 
Our Families, Partners, and Children: Your understanding and constant support have been the backbone of our work. Balancing academic commitments with personal lives is a challenge, and your patience and encouragement have been invaluable. We are sincerely grateful for your love and support.
 
Professor Patrick Hill:  We are very thankful for your guidance and mentorship throughout the semester. Your instructional videos were not only informative but also a source of inspiration. Your prompt and clear responses to our queries, whether regarding the labs or the final project, helped us learn more effectively. Your dedication to teaching and genuine care for our learning has left a lasting impact on us.





-----------------------------------------------------------------------------------------------------------

To run locally please add .env file in in the CS546 directory  

include below in .env file. Reach out to team for property values

FRAP_EMAIL=
EMAIL_PASS=
MONGO_SESSION_URL=
MONGO_URL=
MONGO_DB=
SESSION_SECRET=

option keys

CHATGPT_KEY=
FRAUDLAB_KEY=