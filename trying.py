import scrapy
from scrapy.selector import Selector
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


start_url = "https://www.viu.com/ott/hk/zh-hk/vod/438417/%E7%82%BA%E4%BD%95%E6%98%AF%E5%90%B3%E7%A7%80%E6%89%8D%EF%BC%9F"
chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")
PATIENCE = 15

def get_driver_response():
    return Selector(text = driver.page_source.encode('utf-8'))

driver.get(start_url)

details = WebDriverWait(driver, PATIENCE).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".video-epi-details")))

print(details.text)
# rendered_response = get_driver_response()
# episode_details = rendered_response.css("div.video-epi-details::text").get()
# series_details = rendered_response.css("div.video-sum::text").get()
# print(episode_details)
# print(series_details)
driver.quit()