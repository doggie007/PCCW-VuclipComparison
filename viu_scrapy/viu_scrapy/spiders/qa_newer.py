import time
import scrapy
from scrapy import Selector
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from ..items import NewerProductItem

class QANewerSpider(scrapy.Spider):
    name = "newer_qa"

    start_urls = ["https://qa-1viu.ottuat.com/ott/hk"]

    custom_settings = {
        'COLLECTION_NAME' : 'QA_NEW'
    }

    def __init__(self):
        #Configure chrome browser
        chrome_options = Options()
        # chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")
        self.seen = {}

    def get_driver_response(self):
        return Selector(text = self.driver.page_source.encode('utf-8'))


    def parse(self, response):
        self.driver.get(response.url)
        rendered_response = self.get_driver_response()
        # print(rendered_response)
        print(len(rendered_response.xpath('//div[contains(@class, "item")]')))

        for container in rendered_response.xpath('//div[contains(@class, "item")]'):

            #Check if is movie
            classes = container.xpath('@class').extract()
            print(classes)
            # time.sleep(1)
            isMovie = False
            for cls in classes:
                cls = cls.strip()
                if cls == "isMovie":
                    isMovie = True
            

            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get()

            try:
                product_name = get_div_attribute("data-product-name")
                series_name = get_div_attribute("data-series-name")
                category_name = get_div_attribute("data-product-category-name")

                product_id = int(get_div_attribute("data-product-id"))
                series_id = int(get_div_attribute("data-series-id"))
                category_id = int(get_div_attribute("data-product-category-id"))

                synopsis = get_div_attribute("data-product-synopsis")
                image_url = container.css("img::attr(src)").get()
                link_page_url = container.css("a::attr(href)").get()
            except:
                continue

            product = NewerProductItem()
            product['product_name'] = product_name
            product['series_name'] = series_name
            product['category_name'] = category_name

            # Set product ID as the id 
            product['_id'] = product_id
            product['series_id'] = series_id
            product['category_id'] = category_id

            product['synopsis'] = synopsis
            product['image_url'] = response.urljoin(image_url)
            product['url'] = response.urljoin(link_page_url)
            product['isMovie'] = isMovie
            yield product



        