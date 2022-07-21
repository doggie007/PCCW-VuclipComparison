# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class NewProductItem(scrapy.Item):
    title = scrapy.Field()
    subtitle = scrapy.Field()
    image_url = scrapy.Field()
    category = scrapy.Field()
    synopsis = scrapy.Field()
    off_shelf_date = scrapy.Field()

class CurrentProductItem(scrapy.Item):
    name = scrapy.Field()
    category_name = scrapy.Field()
    series_name = scrapy.Field()
    product_id = scrapy.Field()
    series_id = scrapy.Field()
    synopsis = scrapy.Field()
    image_url = scrapy.Field()
