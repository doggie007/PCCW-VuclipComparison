import time
import scrapy
from scrapy import Selector
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains


def get_driver_response(driver):
    return Selector(text = driver.page_source.encode('utf-8'))


url = "https://qa-1viu.ottuat.com/ott/hk/zh-hk/vod/848/%E6%A8%B9%E5%A4%A7%E6%A0%B9%E6%B7%B1"
# url = "https://qa-1viu.ottuat.com/ott/hk/zh-hk/vod/10520/%E6%95%B8%E7%A2%BC%E6%9A%B4%E9%BE%8D%E5%A4%A7%E5%86%92%E9%9A%AAtri"
chrome_options = Options()
# chrome_options.add_argument("--headless")
chrome_options.add_argument("log-level=3")
driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")
print("Driver created")
driver.get(url)

# _ = WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-epi-details")))

try:
    _ = WebDriverWait(driver, 4).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-epi-details")))
except:
    print("Not possible")

list_items = driver.find_elements(By.CSS_SELECTOR,"li.episode-item.released")

actions = ActionChains(driver)

for list_item in list_items:
    # actions.move_to_element(list_item).perform()
    anchor = list_item.find_element(By.CSS_SELECTOR,"a")
    episode_link = anchor.get_attribute('href')
    episode_name = anchor.get_attribute('title').split(" - ")[1]
    episode_id = list_item.get_attribute('data-id')
    episode_number = list_item.get_attribute('id').split("-")[1]
    cover_img_url = list_item.find_element(By.CSS_SELECTOR, "img").get_attribute("data-original")
    print(episode_name, episode_number, cover_img_url)

# for list_item in list_items:
#     
#     print(cover_img_url)

# summary = driver.find_element(By.CLASS_NAME, "video-sum").get_attribute("textContent")



# list_items = driver.find_elements(By.CSS_SELECTOR,"li.episode-item.released")
# for list_item in list_items:
#     anchor = list_item.find_element(By.CSS_SELECTOR,"a")
#     print(anchor.get_attribute('href'))
    # print(list_item)
    #Find all other properties

# b = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "video-sum")))
# print(video_.getText())

# print(driver.find_element(By.CLASS_NAME, "video-epi-details").text)
# print(driver.find_element(By.CLASS_NAME, "video-sum").text)
# print(a.text)
# print(driver.find_element(By.CLASS_NAME, "video-sum").get_attribute("textContent"))


driver.quit()


    