import scrapy
from ..items import ProductItem


class LandingScraper(scrapy.Spider):
    name = "landing"
    allowed_domains = ["qa.ottuat.com"]
    start_urls = ["https://qa.ottuat.com/ott/hk"]

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

    def parse_link_page(self, response, product):
        product["category"] = response.css("#category::text").get()
        product["synopsis"] = response.css("#synopsis::text").get()
        try:
            product["off_shelf_date"] = response.css(
                "#off_shelf_date::text")[2].get()
        except:
            product["off_shelf_date"] = None
        return product


"""
scrapy crawl landing -O info.json


response.css("span::text")
.MuiChip-label.MuiChip-labelMedium.css-14vsv3w




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
