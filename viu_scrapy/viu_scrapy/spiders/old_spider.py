import scrapy
from ..items import ProductItem
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging

class HappySpider(scrapy.Spider):    
    name = "happy"
    # allowed_domains = ["qa.ottuat.com"]
    start_urls = ["https://www.viu.com/ott/hk/"]
    def parse(self, response):
        pass
        # options = webdriver.ChromeOptions()
        # options.add_argument("headless")
        # desired_capabilities = options.to_capabilities()
        # driver = webdriver.Chrome(desired_capabilities=desired_capabilities)
        # driver.get("https://openaq.org/#/countries")
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
        """




