import scrapy
from scrapy.selector import Selector
from ..items import NewProductItem

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class NewSpider(scrapy.Spider):
    name = "new"

    start_urls = ["https://qa.ottuat.com/ott/hk"]

    custom_settings = {
        'COLLECTION_NAME' : 'QA'
    }

    PATIENCE = 15

    def __init__(self):
        #Configure chrome browser
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")

    def get_driver_response(self):
        return Selector(text = self.driver.page_source.encode('utf-8'))


    def parse(self, response):
        for container in response.css("div.css-79elbk"):
            title = container.css(
                "div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
            subtitle = container.css(
                "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
            image_url = container.css("img::attr(src)").get()
            link_page_url = container.css('a::attr(href)').get()

            product = NewProductItem()
            product['title'] = title
            product['subtitle'] = subtitle
            product['image_url'] = response.urljoin(image_url)

            yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))
        
        secondary_page_links = response.css("a.css-1tqdl5x")
        yield from response.follow_all(secondary_page_links, callback = self.parse_secondary_page)

    def parse_link_page(self, response, product):
        product["category"] = response.css("#category::text").get()
        product["synopsis"] = response.css("#synopsis::text").get()
        product["off_shelf_date"] = response.css("#off_shelf_date::text").get()
        return product


    def parse_secondary_page(self, response):

        self.driver.get(response.url)
        WebDriverWait(self.driver, self.PATIENCE)
        rendered_response = self.get_driver_response()

        #from the Top 10 人氣劇
        for container in rendered_response.css("div.css-79elbk"):
            title = container.css(
                "div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
            subtitle = container.css(
                "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
            image_url = container.css("img::attr(src)").get()
            link_page_url = container.css('a::attr(href)').get()

            product = NewProductItem()
            product['title'] = title
            product['subtitle'] = subtitle
            product['image_url'] = response.urljoin(image_url)
            yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))
        

        #Keep clicking on more button

        # while True:
        #     try:
        #         btn = WebDriverWait(self.driver, self.PATIENCE).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".load-more-btn")))
        #         btn.click()
        #     except:
        #         #Scrolled to end of page
        #         break

        #from the top container
        for container in rendered_response.css("div.MuiBox-root.css-1wvmlch div.MuiBox-root.css-0"):
            title = container.css("div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
            subtitle = container.css(
                "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
            image_url = container.css("img::attr(src)").get()
            link_page_url = container.css('a::attr(href)').get()
            product = NewProductItem()
            product['title'] = title
            product['subtitle'] = subtitle
            product['image_url'] = response.urljoin(image_url)
            yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))




        
    #     #from the top container
    #     for container in response.css("div.MuiBox-root.css-0"):
    #         print(container.css("a::attr(href)").get())
    #         subtitle = container.css(
    #             "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
    #         image_url = container.css("img::attr(src)").get()
    #         link_page_url = container.css('::attr(href)').get()
    #         product = ProductItem()
    #         product['title'] = title
    #         product['subtitle'] = subtitle
    #         product['image_url'] = image_url
    #         yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product), dont_filter=True)


        






"""
a.MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineNone.css-1tqdl5x

MuiBox-root css-j7qwjs

scrapy crawl landing -O info.json
css-1tqdl5x

response.css("span::text")
.MuiChip-label.MuiChip-labelMedium.css-14vsv3w



MuiBox-root css-j7qwjs



Box 

css-79elbk
MuiBox-root css-0

Unopened

Titles:  MuiTypography-root MuiTypography-titleSm css-1jk6smf

Subtitle: MuiTypography-root MuiTypography-bodySm css-jgl8ul

Image: MuiBox-root css-tz51zb


Opened

Subtitle: MuiTypography-root MuiTypography-bodyMd thumbnail_category css-1sn35ts

Under Subtitle: MuiTypography-root MuiTypography-bodySm thumbnail_ep_desc css-91znxs




Main Page Box
class="MuiContainer-root css-1ireu8r"

id synopsis

"""
