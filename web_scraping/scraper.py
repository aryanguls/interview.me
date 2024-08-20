# multiple pages of questions for each interview type (SWE, PM, etc etc.)
# parallelize the requests for each pagination page under the request limit 
# json output - problem, company(s), type(s): behavioral;technical;etc , 

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up the WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

driver.get("https://www.productmanagementexercises.com/interview-questions/behavioral")

def scrape_interview_questions():
    questions = []
    
    # Wait for the questions to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "question-card"))
    )
    
    # Find all question cards
    question_cards = driver.find_elements(By.CLASS_NAME, "question-card")
    
    for card in question_cards:
        # Extract question title
        title_element = card.find_element(By.CLASS_NAME, "question-title")
        question_title = title_element.text
        
        # Extract companies
        companies = []
        company_elements = card.find_elements(By.CSS_SELECTOR, ".question-tags-ab .text")
        for company in company_elements:
            companies.append(company.text)
        
        # Extract tags
        tags = []
        tag_elements = card.find_elements(By.CSS_SELECTOR, ".question-tags span:nth-child(2)")
        for tag in tag_elements:
            tags.append(tag.text)
        
        questions.append({
            "title": question_title,
            "companies": companies,
            "tags": tags
        })
    
    return questions

interview_questions = scrape_interview_questions()

# Print or process the scraped data
for question in interview_questions:
    print(f"Question: {question['title']}")
    print(f"Companies: {', '.join(question['companies'])}")
    print(f"Tags: {', '.join(question['tags'])}")
    print("---")

# Close the browser
driver.quit()