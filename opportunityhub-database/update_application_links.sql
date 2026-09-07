USE opportunityhub;

-- Set official career/application destinations for all 9 companies.
-- This changes only application_link.
UPDATE opportunities
SET application_link = CASE
    WHEN LOWER(organization) = 'google' THEN 'https://www.google.com/about/careers/applications/jobs/results/'
    WHEN LOWER(organization) = 'amazon' THEN 'https://www.amazon.jobs/en/'
    WHEN LOWER(organization) = 'microsoft' THEN 'https://jobs.careers.microsoft.com/global/en/home'
    WHEN LOWER(organization) = 'ibm' THEN 'https://www.ibm.com/careers/search'
    WHEN LOWER(organization) = 'adobe' THEN 'https://careers.adobe.com/us/en/'
    WHEN LOWER(organization) = 'tcs' THEN 'https://www.tcs.com/careers'
    WHEN LOWER(organization) = 'infosys' THEN 'https://careers.infosys.com/'
    WHEN LOWER(organization) = 'oracle' THEN 'https://www.oracle.com/in/careers/'
    WHEN LOWER(organization) = 'wipro' THEN 'https://careers.wipro.com/'
    ELSE application_link
END
WHERE LOWER(organization) IN (
    'google', 'amazon', 'microsoft', 'ibm', 'adobe',
    'tcs', 'infosys', 'oracle', 'wipro'
);

SELECT id, title, organization, application_link
FROM opportunities
WHERE LOWER(organization) IN (
    'google', 'amazon', 'microsoft', 'ibm', 'adobe',
    'tcs', 'infosys', 'oracle', 'wipro'
)
ORDER BY id;
