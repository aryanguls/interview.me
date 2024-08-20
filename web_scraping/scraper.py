# multiple pages of questions for each interview type (SWE, PM, etc etc.)
# parallelize the requests for each pagination page under the request limit 
# json output - problem, company(s), type(s): behavioral;technical;etc , 

import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
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
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "question-card"))
        )
        question_cards = driver.find_elements(By.CLASS_NAME, "question-card")
        for card in question_cards:
            title_element = card.find_element(By.CLASS_NAME, "question-title")
            question_title = title_element.text
            companies = []
            company_elements = card.find_elements(By.CSS_SELECTOR, ".question-tags-ab .text")
            for company in company_elements:
                companies.append(company.text)
            try:
                extra_companies_element = card.find_element(By.CLASS_NAME, "ask-at-multi-comp")
                data_content = extra_companies_element.get_attribute('data-content')
                soup = BeautifulSoup(data_content, 'html.parser')
                extra_companies = [a.text.strip() for a in soup.find_all('a', class_='question-tags-ab')]
                companies.extend(extra_companies)
            except NoSuchElementException:
                pass
            companies = clean_companies(companies)
            tags = []
            tag_elements = card.find_elements(By.CSS_SELECTOR, ".question-tags")
            for tag_element in tag_elements:
                href = tag_element.get_attribute('href')
                if href:
                    tag = href.split('/')[-1]
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
        time.sleep(2)
        return True
    except (NoSuchElementException, TimeoutException, ElementClickInterceptedException):
        print("No more pages to navigate")
        return False

def scrape_all_pages(driver):
    all_questions = []
    page = 1
    while True:
        print(f"Scraping page {page}...")
        questions = scrape_page(driver)
        all_questions.extend(questions)
        if not go_to_next_page(driver):
            break
        page += 1
    return all_questions

def scrape_category(category):
    print(f"Starting to scrape category: {category}")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    try:
        url = f"https://www.productmanagementexercises.com/interview-questions/{category}"
        driver.get(url)
        time.sleep(5)
        questions = scrape_all_pages(driver)
        with open(f'{category}_interview_questions.json', 'w') as f:
            json.dump(questions, f, indent=2)
        print(f"Total questions found for {category}: {len(questions)}")
        print(f"Data has been saved to {category}_interview_questions.json")
    finally:
        driver.quit()
    return category, len(questions)

# List of categories to scrape
categories = [
    "estimation", "metrics", "product-design", "product-improvement", 
    "problem-solving", "product-launch", "product-strategy", "ab-testing", 
    "execution", "product-growth", "technical", "behavioral", "other", 
    "leadership-and-development", "product-sense"
]

# Number of concurrent workers (adjust based on your system's capabilities)
MAX_WORKERS = 5

# Use ThreadPoolExecutor for parallelization
with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    future_to_category = {executor.submit(scrape_category, category): category for category in categories}
    for future in as_completed(future_to_category):
        category = future_to_category[future]
        try:
            category, num_questions = future.result()
            print(f"Completed scraping {category}: {num_questions} questions")
        except Exception as exc:
            print(f"{category} generated an exception: {exc}")

print("All categories have been scraped.")