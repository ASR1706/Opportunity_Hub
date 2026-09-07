USE opportunityhub;

-- Remove the placeholder URL from the existing three records.
UPDATE opportunities
SET application_link = NULL
WHERE application_link LIKE '%example.com%';

-- Add a more realistic and varied opportunity dataset so every page does not look identical.
INSERT INTO opportunities
(title, description, organization, location, type, skills, deadline, eligibility, application_link, remote)
SELECT 'Software Engineer Intern', 'Build and test scalable software components with an engineering team.', 'IBM', 'Bengaluru', 'Internship', 'Java, Python, SQL, Git', '2026-10-20', 'B.Tech students with programming and SQL fundamentals', 'https://www.ibm.com/careers/search', false
WHERE NOT EXISTS (
    SELECT 1 FROM opportunities WHERE title = 'Software Engineer Intern' AND organization = 'IBM'
);

INSERT INTO opportunities
(title, description, organization, location, type, skills, deadline, eligibility, application_link, remote)
SELECT 'Frontend Developer Intern', 'Work on responsive web interfaces and reusable frontend components.', 'Adobe', 'Noida', 'Internship', 'HTML, CSS, JavaScript, React', '2026-10-25', 'B.Tech students with frontend development skills', 'https://careers.adobe.com/', false
WHERE NOT EXISTS (
    SELECT 1 FROM opportunities WHERE title = 'Frontend Developer Intern' AND organization = 'Adobe'
);

INSERT INTO opportunities
(title, description, organization, location, type, skills, deadline, eligibility, application_link, remote)
SELECT 'Graduate Software Engineer', 'Develop production applications and collaborate across engineering teams.', 'TCS', 'Pune', 'Job', 'Java, Spring Boot, SQL, REST API', '2026-11-05', 'Final-year B.Tech students and recent graduates', 'https://www.tcs.com/careers', false
WHERE NOT EXISTS (
    SELECT 1 FROM opportunities WHERE title = 'Graduate Software Engineer' AND organization = 'TCS'
);

INSERT INTO opportunities
(title, description, organization, location, type, skills, deadline, eligibility, application_link, remote)
SELECT 'Systems Engineer Trainee', 'Support software delivery and learn enterprise engineering practices.', 'Infosys', 'Hyderabad', 'Job', 'Java, SQL, Python, Git', '2026-11-10', 'B.Tech students with strong programming fundamentals', 'https://www.infosys.com/careers.html', false
WHERE NOT EXISTS (
    SELECT 1 FROM opportunities WHERE title = 'Systems Engineer Trainee' AND organization = 'Infosys'
);

INSERT INTO opportunities
(title, description, organization, location, type, skills, deadline, eligibility, application_link, remote)
SELECT 'Software Development Intern', 'Build backend services and contribute to cloud-based products.', 'Oracle', 'Hyderabad', 'Internship', 'Java, SQL, REST API, Cloud', '2026-10-30', 'B.Tech students interested in backend and cloud development', 'https://www.oracle.com/careers/', false
WHERE NOT EXISTS (
    SELECT 1 FROM opportunities WHERE title = 'Software Development Intern' AND organization = 'Oracle'
);

INSERT INTO opportunities
(title, description, organization, location, type, skills, deadline, eligibility, application_link, remote)
SELECT 'Associate Software Engineer', 'Develop reliable applications and participate in testing and code reviews.', 'Wipro', 'Bengaluru', 'Job', 'Java, SQL, JavaScript, DSA', '2026-11-15', 'Final-year B.Tech students with good problem-solving skills', 'https://careers.wipro.com/', false
WHERE NOT EXISTS (
    SELECT 1 FROM opportunities WHERE title = 'Associate Software Engineer' AND organization = 'Wipro'
);

SELECT id, title, organization, location, type, deadline
FROM opportunities
ORDER BY id;
