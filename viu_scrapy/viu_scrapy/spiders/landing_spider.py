import scrapy

class LandingScraper(scrapy.Spider):
    name = 'landing'
    allowed_domains = ['qa.ottuat.com']
    start_urls = ['https://qa.ottuat.com/ott/hk']

    def parse(self, response):
        for box in response.css('div.css-79elbk'):
            yield {
                'title': box.css('div.MuiTypography-root.MuiTypography-titleSm.css-1jk6smf::text').get(),
                'card_description': box.css('div.MuiTypography-root.MuiTypography-bodySm.css-jgl8ul::text').get(),
                'card_image_url': box.css('img::attr(src)').get(),
            }
    #     next_page = response.css('a::attr(href)').get()
    #     if next_page is not None:
    #         yield response.follow(next_page, self.parse_main)

    # def parse_main(self, response):
    #     box = response.css('div.MuiContainer-root.css-1ireu8r').get()
    #     if box is not None:







"""
scrapy crawl landing -O info.json


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