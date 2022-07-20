import scrapy
from ..items import ProductItem


class LandingScraper(scrapy.Spider):
    name = "landing"
    # allowed_domains = ["qa.ottuat.com"]
    start_urls = ["https://qa.ottuat.com/ott/hk"]
    # start_urls = ["https://qa.ottuat.com/ott/hk/zh-hk/category/2/%E9%9F%93%E5%8A%87"]

    def parse(self, response):
        for container in response.css("div.css-79elbk"):
            title = container.css(
                "div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
            subtitle = container.css(
                "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
            image_url = container.css("img::attr(src)").get()
            link_page_url = container.css('a::attr(href)').get()

            product = ProductItem()
            product['title'] = title
            product['subtitle'] = subtitle
            product['image_url'] = image_url

            yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product), dont_filter=True)
        
        # secondary_page_links = response.css("a.css-1tqdl5x")
        # yield from response.follow_all(secondary_page_links, callback = self.parse_secondary_page)

    def parse_link_page(self, response, product):
        product["category"] = response.css("#category::text").get()
        product["synopsis"] = response.css("#synopsis::text").get()
        product["off_shelf_date"] = response.css("#off_shelf_date::text").get()
        return product


    # def parse(self, response):
    #     #from the Top 10 人氣劇
    #     # for container in response.css("div.css-79elbk"):
    #     #     title = container.css(
    #     #         "div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text").get()
    #     #     subtitle = container.css(
    #     #         "div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text").get()
    #     #     image_url = container.css("img::attr(src)").get()
    #     #     link_page_url = container.css('a::attr(href)').get()

    #     #     product = ProductItem()
    #     #     product['title'] = title
    #     #     product['subtitle'] = subtitle
    #     #     product['image_url'] = image_url
    #     #     yield response.follow(link_page_url, self.parse_link_page, cb_kwargs=dict(product=product), dont_filter=True)
        
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
