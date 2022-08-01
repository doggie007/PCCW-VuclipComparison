import scrapy
from scrapy import Selector
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ..items import Series, Movie, Episode
from ..helper import LinkPageProcessor



class QAOlderSpider(scrapy.Spider):
    name = "older_qa"

    start_urls = ["https://qa-1viu.ottuat.com/ott/hk/zh-hk/"]

    # custom_settings = {
    #     'COLLECTION_NAME' : 'QA_NEW'
    # }

    PATIENCE = 10

    def __init__(self):
        #Configure chrome browser
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("log-level=3")
        self.driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=r"C:\Users\james\Desktop\My Stuff\PCCW\PCCW-VuclipComparison\chromedriver")
        self.seen_series = set() #filters by series id
        self.seen_product = set() #filters by product id

    
    def __del__(self):
        self.driver.quit()
        print("Driver has terminated")
    

    def get_driver_response(self):
        return Selector(text = self.driver.page_source.encode('utf-8'))



    def parse(self, response):
        self.driver.get(response.url)
        try:
            WebDriverWait(self.driver, self.PATIENCE).until(EC.invisibility_of_element((By.CLASS_NAME, "loading")))
        except:
            raise Exception("Could not load the landing page")
        rendered_response = self.get_driver_response()

        stored_products = []
        stored_episodes = []

        for container in rendered_response.xpath('//div[contains(@class, "item")]'):

            #Check if is movie
            classes = container.xpath('@class').extract()[0].split()
            isMovie = True if "isMovie" in classes else False
            

            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get().strip()

            try:
                product_name = get_div_attribute("data-product-name")
                series_name = get_div_attribute("data-series-name")
                category_name = get_div_attribute("data-product-category-name")

                product_number = int(get_div_attribute("data-product-number"))
                product_id = int(get_div_attribute("data-product-id"))
                series_id = int(get_div_attribute("data-series-id"))


                synopsis = get_div_attribute("data-product-synopsis")
                image_url = container.css("img::attr(src)").get()
                link_page_url = container.css("a::attr(href)").get()
            except:
                continue
            

            if product_id in self.seen_product:
                continue
            elif isMovie:
                assert not (series_id in self.seen_series)
                product = Movie()
                product['_id'] = series_id
                product['product_id'] = product_id
                product['product_name'] = product_name
                product['category_name'] = category_name
                product['image_url'] = response.urljoin(image_url)
                product['url'] = response.urljoin(link_page_url)
                product['synopsis'] = synopsis
                #Get summary from subpage
                stored_products.append(product)

            else:
                if not (series_id in self.seen_series):
                    # Create a new series item
                    assert not isMovie
                    product = Series()
                    product['_id'] = series_id
                    product['series_name'] = series_name
                    product['category_name'] = category_name
                    product['image_url'] = response.urljoin(image_url)
                    product['url'] = response.urljoin(link_page_url)
                    #Get summary from subpage
                    stored_products.append(product)

            
                # Create an episode
                episode = Episode()
                episode['_id'] = product_id
                episode['series_id'] = series_id
                episode['episode_name'] = synopsis
                episode['episode_number'] = product_number
                episode['url'] = response.urljoin(link_page_url)
                episode['cover_img_url'] = response.urljoin(image_url)

                stored_episodes.append(episode)


            self.seen_product.add(product_id)
            self.seen_series.add(series_id)


        link_processor = LinkPageProcessor()
        yield from link_processor.process_products(stored_products)
        yield from link_processor.process_episodes(stored_episodes)

        # yield from stored_products

        # display_alls = rendered_response.css("a.show_all")
        # print(display_alls)
        # yield from response.follow_all(display_alls, callback=self.parse_subpage)



        # yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product))
        

        # anchors = response.css("ul.v-nav li a")
        # yield from response.follow_all(anchors, callback=self.parse_subpage)
    """
    def parse_subpage(self, response):
        self.driver.get(response.url)
        while True:
            try:
                # Wait for loading
                btn = WebDriverWait(self.driver, self.PATIENCE).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".load-more-btn")))
                btn.click()
            except:
                # Scrolled to end of page
                break

        rendered_response = self.get_driver_response()

        for container in rendered_response.css("#cat_list").xpath("//div[starts-with(@id, 'item_')]"):
            classes = container.xpath('@class').extract()[0].split()
            isMovie = True if "movieThumb" in classes else False

            def get_div_attribute(attribute_name):
                return container.css(f"::attr({attribute_name})").get()

            try:
                series_name = get_div_attribute("series_name")
                category_name = get_div_attribute("category_name")

                product_id = int(get_div_attribute("product_id"))
                series_id = int(get_div_attribute("series_id"))

                # category_id = int(get_div_attribute("data-product-category-id"))
                # product_number = int(get_div_attribute("data-product-number"))

                synopsis = get_div_attribute("data-product-synopsis")
                image_url = container.css("img::attr(src)").get()
                link_page_url = container.css("a::attr(href)").get()
            except:
                continue
            
            if series_id in self.seen_series:
                continue
            else:
                self.seen_series.add(series_id)

            if isMovie:
                product = Movie()
                product['_id'] = product_id
                product['series_id'] = series_id
                product['product_name'] = series_name
                product['category_name'] = category_name
                product['image_url'] = response.urljoin(image_url)
                product['url'] = response.urljoin(link_page_url)
                product['synopsis'] = synopsis
                #Get summary from subpage
            else:
                product = Series()
                product['_id'] = series_id

                product['series_name'] = series_name
                product['category_name'] = category_name
                
                product['synopsis'] = synopsis
                product['image_url'] = response.urljoin(image_url)
                product['latest_episode_url'] = response.urljoin(link_page_url)
            yield product
    """

    #         # product['product_name'] = get_div_attribute("series_name")


    #         product['series_name'] = 
    #         product['category_name'] = 

    #         product['product_number'] = product_number

    #         # Set product ID as the id 
    #         product['product_id'] = get_div_attribute("product_id") #
    #         product['series_id'] = get_div_attribute("series_id") #

    #         product['synopsis'] = synopsis
    #         product['image_url'] = response.urljoin(image_url)
    #         product['url'] = response.urljoin(link_page_url)
    #         product['isMovie'] = isMovie

    #         product = NewerProductItem()
    #         #Assuming the name is the same as the series name
    #         product['name'] = 
    #         product['category_name'] = get_div_attribute("category_name")
    #         product['series_name'] = get_div_attribute("series_name")


    #         product['description'] = get_div_attribute("description") #

    #         product['image_url'] = response.urljoin(container.css("img::attr(src)").get())
    #         link_page_url = container.css("a::attr(href)").get()

    # def parse_link_page(self, response, product):
    #     driverObj = Driver()
    #     driverObj.driver.get(response.url)
    #     if product["isMovie"]:
    #         try:
    #             a = WebDriverWait(driverObj.driver, self.PATIENCE).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-sum")))
    #         except:
    #             product["episode_details"] = None
    #             product["summary"] = None
    #             return product
    #         episode_details = None
    #         summary = a.text
    #     else:
    #         try:
    #             a = WebDriverWait(driverObj.driver, self.PATIENCE).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-epi-details")))
    #         except:
    #             product["episode_details"] = None
    #             product["summary"] = None
    #             return product
    #         episode_details = a.text
    #         summary = driverObj.driver.find_element(By.CLASS_NAME, "video-sum").get_attribute("textContent")
    #     product["episode_details"] = episode_details
    #     product["summary"] = summary
    #     return product




    # def process_link_page(self, url, product):
    #     self.driver.get(url)
    #     try:
    #         WebDriverWait(self.driver, self.PATIENCE).until(EC.visibility_of_element_located((By.CLASS_NAME, "video-sum")))
    #     except:
    #         product["episode_details"] = None
    #         product["summary"] = None
    #         return product

    #     rendered_response = self.get_driver_response()

    #     if product["isMovie"]:
    #         episode_details = None
    #         summary = rendered_response.css(".video-sum::text").get()
    #     else:
    #         episode_details = rendered_response.css(".video-epi-details::text").get()
    #         summary = rendered_response.css(".video-sum::text").get()
        
    #     product["episode_details"] = episode_details
    #     product["summary"] = summary
    #     return product



        