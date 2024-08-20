# multiple pages of questions for each interview type (SWE, PM, etc etc.)
# parallelize the requests for each pagination page under the request limit 
# json output - problem, company(s), type(s): behavioral;technical;etc , 

import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementClickInterceptedException

def clean_companies(companies):
    return [company.strip().lower() for company in companies if company.strip()]

def scrape_page(driver):
    questions = []
    
    try:
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
            
            # Extract extra companies info
            try:
                extra_companies_element = card.find_element(By.CLASS_NAME, "ask-at-multi-comp")
                data_content = extra_companies_element.get_attribute('data-content')
                
                # Use BeautifulSoup to parse the HTML content
                soup = BeautifulSoup(data_content, 'html.parser')
                
                # Find all company names
                extra_companies = [a.text.strip() for a in soup.find_all('a', class_='question-tags-ab')]
                
                companies.extend(extra_companies)
            except NoSuchElementException:
                pass  # No extra companies
            
            # Clean up companies
            companies = clean_companies(companies)
            
            # Extract tags
            tags = []
            tag_elements = card.find_elements(By.CSS_SELECTOR, ".question-tags")
            for tag_element in tag_elements:
                href = tag_element.get_attribute('href')
                if href:
                    tag = href.split('/')[-1]  # Get the last part of the URL
                    tags.append(tag)
            
            questions.append({
                "title": question_title,
                "companies": companies,
                "tags": tags
            })
        
        return questions
    except TimeoutException:
        print("No questions found on this page")
        return []

def go_to_next_page(driver):
    try:
        next_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".qa-page-links-item[data-page='next']"))
        )
        next_button.click()
        time.sleep(2)  # Wait for the page to load
        return True
    except (NoSuchElementException, TimeoutException, ElementClickInterceptedException):
        print("No more pages to navigate")
        return False

def scrape_all_pages(driver, url):
    all_questions = []
    page = 1
    
    driver.get(url)
    
    while True:
        print(f"Scraping page {page}...")
        questions = scrape_page(driver)
        all_questions.extend(questions)
        
        if not go_to_next_page(driver):
            break
        
        page += 1
    
    return all_questions

# Set up the WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

url = "https://www.productmanagementexercises.com/interview-questions/behavioral"
interview_questions = scrape_all_pages(driver, url)

# Close the browser
driver.quit()

# Save to JSON file
with open('interview_questions.json', 'w') as f:
    json.dump(interview_questions, f, indent=2)

print(f"Total questions found: {len(interview_questions)}")
print("Data has been saved to interview_questions.json")