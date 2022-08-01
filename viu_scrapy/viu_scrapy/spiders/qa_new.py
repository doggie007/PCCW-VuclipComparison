import scrapy
from scrapy.selector import Selector
from ..items import NewProductItem
from ..items import Series, Episode, Movie

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from ..helper import NewLinkPageProcessor


import hashlib

class NewSpider(scrapy.Spider):
    name = "new"

    start_urls = ["https://qa.ottuat.com/ott/hk"]

    PATIENCE = 10

    def __init__(self):
        #Configure chrome browser
        chrome_options = Options()
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("log-level=3")
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")
        self.seen_series = set() #filters by series_id
        self.seen_product = set() #filters by product id

    def get_driver_response(self):
        return Selector(text = self.driver.page_source.encode('utf-8'))

    def __del__(self):
        self.driver.quit()
        print("Driver has terminated")

    def parse(self, response):
        self.driver.get(response.url)
        selenium_containers = self.driver.find_elements(By.CSS_SELECTOR, "div.css-79elbk")
        # rendered_response = self.get_driver_response()
        
        stored_products = []
        stored_episodes = []
        for container, selenium_container in zip(response.css("div.css-79elbk"), selenium_containers):
            try:
                title = container.css(
                    "div.MuiTypography-root.MuiTypography-titleSm.css-9oivr2::text").get()
                subtitle = container.css(
                    "div.MuiTypography-root.MuiTypography-bodySm.css-4oxed5::text").get()
                isMovie = subtitle == "Movie"
                image_url = container.css("img::attr(src)").get()
                link_page_url = container.css('a::attr(href)').get()
                
                print(title, subtitle, isMovie, image_url, link_page_url)

                product_id = int(link_page_url.strip('/').split('/')[-2])

                #Generate a hash of the title as series_id
                series_id = int(hashlib.sha256(title.encode('utf-8')).hexdigest(), 16) % 10**8
                
                if not isMovie:
                    # print(container.css('span.thumbnail_bottom_meta_tag span::text').get())
                    episode_number = int(container.css('span.thumbnail_bottom_meta_tag span::text').get()[1:-1])
                    # hover = ActionChains(self.driver).move_to_element(selenium_container)
                    # hover.perform()
                    # floating_el = WebDriverWait(self.driver, self.PATIENCE).until(EC.visibility_of_element_located((By.ID, "floating-ui-root")))
                    # episode_name = floating_el.find_element(By.CLASS_NAME, "css-dcwkcg").text
                    # print(episode_name)
            except:
                continue



            if product_id in self.seen_product:
                continue
            elif isMovie:
                assert not (series_id in self.seen_series)
                product = Movie()
                product['_id'] = series_id
                product['product_id'] = product_id
                product['product_name'] = title
                product['category_name'] = subtitle
                product['image_url'] = response.urljoin(image_url)
                product['url'] = response.urljoin(link_page_url)
                product['synopsis'] = None
                #Get summary from subpage
                stored_products.append(product)
            else:
                if not (series_id in self.seen_series):
                    # Create a new series item
                    assert not isMovie
                    product = Series()
                    product['_id'] = series_id
                    product['series_name'] = title
                    product['category_name'] = subtitle
                    product['image_url'] = response.urljoin(image_url)
                    product['url'] = response.urljoin(link_page_url)
                    #Get summary from subpage
                    stored_products.append(product)
                episode = Episode()
                episode['_id'] = product_id
                episode['series_id'] = series_id
                episode['episode_name'] = None
                episode['episode_number'] = episode_number
                episode['url'] = response.urljoin(link_page_url)
                episode['cover_img_url'] = response.urljoin(image_url)
                stored_episodes.append(episode)

        link_processor = NewLinkPageProcessor()
        yield from link_processor.process_products(stored_products)
        yield from link_processor.process_episodes(stored_episodes)   
            # product = NewProductItem()
            # product['title'] = title
            # product['subtitle'] = subtitle
            # product['image_url'] = response.urljoin(image_url)

            # yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))









# class NewSpider(scrapy.Spider):
#     name = "new"

#     start_urls = ["https://qa.ottuat.com/ott/hk"]

#     # custom_settings = {
#     #     'COLLECTION_NAME' : 'QA'
#     # }

#     PATIENCE = 10

#     def __init__(self):
#         #Configure chrome browser
#         chrome_options = Options()
#         chrome_options.add_argument("--headless")
#         chrome_options.add_argument("log-level=3")
#         self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")

#     def get_driver_response(self):
#         return Selector(text = self.driver.page_source.encode('utf-8'))


#     def parse(self, response):
#         for container in response.css("div.css-79elbk"):
#             title = container.css(
#                 "div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
#             subtitle = container.css(
#                 "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
#             image_url = container.css("img::attr(src)").get()
#             link_page_url = container.css('a::attr(href)').get()

#             product = NewProductItem()
#             product['title'] = title
#             product['subtitle'] = subtitle
#             product['image_url'] = response.urljoin(image_url)

#             yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))
        
#         secondary_page_links = response.css("a.css-1tqdl5x")
#         yield from response.follow_all(secondary_page_links, callback = self.parse_secondary_page)

#     def parse_link_page(self, response, product):
#         product["category"] = response.css("#category::text").get()
#         product["synopsis"] = response.css("#synopsis::text").get()
#         product["off_shelf_date"] = response.css("#off_shelf_date::text").get()
#         return product


#     def parse_secondary_page(self, response):

#         self.driver.get(response.url)
#         WebDriverWait(self.driver, self.PATIENCE)
#         rendered_response = self.get_driver_response()

#         #from the Top 10 人氣劇
#         for container in rendered_response.css("div.css-79elbk"):
#             title = container.css(
#                 "div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
#             subtitle = container.css(
#                 "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
#             image_url = container.css("img::attr(src)").get()
#             link_page_url = container.css('a::attr(href)').get()

#             product = NewProductItem()
#             product['title'] = title
#             product['subtitle'] = subtitle
#             product['image_url'] = response.urljoin(image_url)
#             yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))
        

#         #Keep clicking on more button

#         # while True:
#         #     try:
#         #         btn = WebDriverWait(self.driver, self.PATIENCE).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".load-more-btn")))
#         #         btn.click()
#         #     except:
#         #         #Scrolled to end of page
#         #         break

#         #from the top container
#         for container in rendered_response.css("div.MuiBox-root.css-1wvmlch div.MuiBox-root.css-0"):
#             title = container.css("div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
#             subtitle = container.css(
#                 "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
#             image_url = container.css("img::attr(src)").get()
#             link_page_url = container.css('a::attr(href)').get()
#             product = NewProductItem()
#             product['title'] = title
#             product['subtitle'] = subtitle
#             product['image_url'] = response.urljoin(image_url)
#             yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))




        
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
