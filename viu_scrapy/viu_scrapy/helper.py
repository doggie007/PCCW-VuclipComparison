from multiprocessing.pool import ThreadPool
import threading
import gc
from functools import partial
import time
from scrapy import Selector
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .items import Series, Episode, Movie


class Driver:
    def __init__(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument('log-level=3')
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")
        print("Driver created")
    
    def __del__(self):
        self.driver.quit()
        print("Driver is terminated")



class LinkPageProcessor:

    PATIENCE = 5 #time(s) before deem error
    PROCESSES = 8 #number of concurrent browsers selenium opens

    def __init__(self):
        self.episodes_to_process = []

    @staticmethod
    def get_driver_response(driver):
        return Selector(text = driver.page_source.encode('utf-8'))

    @staticmethod
    def create_subdriver(threadLocal):
        the_driver = getattr(threadLocal, 'the_driver', None)
        if the_driver is None:
            the_driver = Driver()
            setattr(threadLocal, 'the_driver', the_driver)
        return the_driver.driver
    
    def process_episodes(self, episode, threadLocal):
        driver = LinkPageProcessor.create_subdriver(threadLocal)
        link = episode['url']
        driver.get(link)
        try:
            episode_details_el = WebDriverWait(driver, LinkPageProcessor.PATIENCE).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-epi-details")))
        except:
            episode["episode_details"] = None
            return episode
        episode_details = episode_details_el.text
        episode["episode_details"] = episode_details
        return episode


    def process_product(self, product, threadLocal):
        driver = LinkPageProcessor.create_subdriver(threadLocal)
        #Adds summary to the movie
        if isinstance(product, Movie):
            driver.get(product["url"])
            try:
                summary_el = WebDriverWait(driver, LinkPageProcessor.PATIENCE).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-sum")))
            except:
                product["summary"] = None
                return product
            summary = summary_el.text
        #Adds summary to the series and stores all related links
        elif isinstance(product, Series):
            driver.get(product["latest_episode_url"])
            try:
                _ = WebDriverWait(driver, LinkPageProcessor.PATIENCE).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-epi-details")))
            except:
                product["summary"] = None
                return product
            
            list_items = driver.find_elements(By.CSS_SELECTOR,"li.episode-item.released")
            for list_item in list_items:
                anchor = list_item.find_element(By.CSS_SELECTOR,"a")
                episode_link = anchor.get_attribute('href')
                episode_name = anchor.get_attribute('title').split(" - ")[1]
                episode_id = list_item.get_attribute('data-id')
                episode_number = list_item.get_attribute('id').split("-")[1]
                cover_img_url = list_item.find_element(By.CSS_SELECTOR, "img").get_attribute("data-original")

                episode = Episode()
                episode['_id'] = int(episode_id)
                episode['series_id'] = product['_id']
                episode['episode_name'] = episode_name
                episode['episode_number'] = int(episode_number)
                episode['url'] = episode_link
                episode['cover_img_url'] = cover_img_url

                self.episodes_to_process.append(episode)

            summary = driver.find_element(By.CLASS_NAME, "video-sum").get_attribute("textContent")
        else:
            raise Exception("Neither a Movie or Series object")
        product["summary"] = summary
        return product

    def process(self, stored_products):
        start = time.time()
        threadLocal = threading.local()
        with ThreadPool(LinkPageProcessor.PROCESSES) as pool:
            stored_products = pool.map(partial(self.process_product, threadLocal=threadLocal), stored_products)
            del threadLocal
            gc.collect()
       
        # threadLocal = threading.local()
        # with ThreadPool(LinkPageProcessor.PROCESSES) as pool:
        #     stored_episodes = pool.map(partial(self.process_episodes, threadLocal=threadLocal), self.episodes_to_process)
        #     del threadLocal
        #     gc.collect()
        with open("info.txt",'w') as file:
            file.write(f"Took {time.time()-start}")
            file.write(f"Length is {len(self.episodes_to_process)}")

        return stored_products