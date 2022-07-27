import scrapy
from scrapy.selector import Selector
from ..items import CurrentProductItem

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import logging


class OldSpider(scrapy.Spider):    
    name = "current"

    start_urls = ["https://www.viu.com/ott/hk/"]

    #Seconds allowed for rendering page content
    PATIENCE = 15

    custom_settings = {
        'COLLECTION_NAME' : 'Tester'
    }


    def __init__(self):
        #Configure chrome browser
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")

   

    def get_driver_response(self):
        return Selector(text = self.driver.page_source.encode('utf-8'))

    def parse(self, response):
        times = 0

        self.driver.get(response.url)
        rendered_response = self.get_driver_response()

        for container in rendered_response.css("div.item"):
            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get()
            name = get_div_attribute("data-product-name")
            category_name = get_div_attribute("data-product-category-name")
            series_name = get_div_attribute("data-series-name")
            product_id = get_div_attribute("data-product-id")
            series_id = get_div_attribute("data-series-id")
            synopsis = get_div_attribute("data-product-synopsis")
            image_url = container.css("img::attr(src)").get()
            link_page_url = container.css("a::attr(href)").get()

            product = CurrentProductItem()
            product['name'] = name
            product['category_name'] = category_name
            product['series_name'] = series_name
            product['product_id'] = product_id
            product['series_id'] = series_id
            product['synopsis'] = synopsis
            product['image_url'] = response.urljoin(image_url)
            product['url'] = response.urljoin(link_page_url)

            # yield product

            yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))
            if times == 4:
                break
            
            times += 1
        
        #All subpages
        # anchors = rendered_response.css("ul.v-nav li a")
        # yield from response.follow_all(anchors, callback=self.parse_subpage)
            

    def parse_subpage(self, response):
        #Keep clicking on more button
        self.driver.get(response.url)
        while True:
            try:
                btn = WebDriverWait(self.driver, self.PATIENCE).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".load-more-btn")))
                btn.click()
            except:
                logging.debug("Scrolled to end of page")
                break

        rendered_response = self.get_driver_response()

        #Bottom bar
        for container in rendered_response.css("div.grid_scroll div.item"):
            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get()
            name = get_div_attribute("data-product-name")
            category_name = get_div_attribute("data-product-category-name")
            series_name = get_div_attribute("data-series-name")
            product_id = get_div_attribute("data-product-id")
            series_id = get_div_attribute("data-series-id")
            synopsis = get_div_attribute("data-product-synopsis")
            image_url = container.css("img::attr(src)").get()
            link_page_url = container.css("a::attr(href)").get()

            product = CurrentProductItem()
            product['name'] = name
            product['category_name'] = category_name
            product['series_name'] = series_name
            product['product_id'] = product_id
            product['series_id'] = series_id
            product['synopsis'] = synopsis
            product['image_url'] =  response.urljoin(image_url)

            yield product

        for container in rendered_response.css("#cat_list").xpath("//div[starts-with(@id, 'item_')]"):
            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get()
            product = CurrentProductItem()
            #Assuming the name is the same as the series name
            product['name'] = get_div_attribute("series_name")
            product['category_name'] = get_div_attribute("category_name")
            product['series_name'] = get_div_attribute("series_name")
            product['product_id'] = get_div_attribute("product_id")
            product['series_id'] = get_div_attribute("series_id")
            product['synopsis'] = get_div_attribute("description")
            product['image_url'] = response.urljoin(container.css("img::attr(src)").get())
            link_page_url = container.css("a::attr(href)").get()


            yield product


    def parse_link_page(self, response, product):
        self.driver.get(response.url)
        episode_details = WebDriverWait(self.driver, self.PATIENCE).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".video-epi-details")))
        # series_details = WebDriverWait(self.driver, self.PATIENCE).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".video-sum")))
        print(episode_details.text)
        # print(episode_details.text)

        product['episode_details'] = episode_details.text
        # product['series_details'] = series_details.text
        return product







        # # # Implicit wait
        # # driver.implicitly_wait(10)

        # # Explicit wait
        # wait = WebDriverWait(driver, 5)
        # wait.until(EC.presence_of_element_located((By.CLASS_NAME, "card__title")))

        # # Extracting country names
        # countries = driver.find_elements_by_class_name("card__title")
        # countries_count = 0
        # # Using Scrapy's yield to store output instead of explicitly writing to a JSON file
        # for country in countries:
        #     yield {
        #         "country": country.text,
        #     }
        #     countries_count += 1

        # driver.quit()
        # logging.debug(f"Total number of Countries in openaq.org: {countries_count}")
        """
        for container in response.css("div.item"):
            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get()
            title = get_div_attribute("data-product-name")
            category = get_div_attribute("data-product-category-name")
            product_id = get_div_attribute("data-product-id")
            series_id = get_div_attribute("data-series-id")
            cover_synopsis = get_div_attribute("data-product-synopsis")

            image_url = container.css("img::attr(src)").get()


            link_url = container.css("a::attr(href)").get()
            # product = ProductItem()
            # product['title'] = title
            # product['subtitle'] = subtitle
            # product['image_url'] = image_url
            yield {
                "title": title,
                "category": category,
                "image_url": image_url,
            }


             # def load_infinite_scroll_page(self, url):
    #     self.driver.get(url)

    #     # #Infinite scrolling
    #     SCROLL_PAUSE_TIME = 0.1

    #     # Get scroll height
    #     last_height = self.driver.execute_script("return document.body.scrollHeight")

    #     while True:
    #         # Scroll down to bottom
    #         self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    #         # Wait to load page
    #         time.sleep(SCROLL_PAUSE_TIME)

    #         # Calculate new scroll height and compare with last scroll height
    #         new_height = self.driver.execute_script("return document.body.scrollHeight")
    #         if new_height == last_height:
    #             break
    #         last_height = new_height

    #     return Selector(text = self.driver.page_source.encode('utf-8'))
        """




