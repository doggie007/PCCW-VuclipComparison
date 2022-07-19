# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ProductItem(scrapy.Item):
    title = scrapy.Field()
    subtitle = scrapy.Field()
    image_url = scrapy.Field()
    category = scrapy.Field()
    synopsis = scrapy.Field()
    off_shelf_date = scrapy.Field()
