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
    url = scrapy.Field()
    episode_details = scrapy.Field()
    series_details = scrapy.Field()


class NewerProductItem(scrapy.Item):
    _id = scrapy.Field()

    product_name = scrapy.Field()
    series_name = scrapy.Field()
    category_name = scrapy.Field()
    isMovie = scrapy.Field()
    product_number = scrapy.Field()

    series_id = scrapy.Field()
    category_id = scrapy.Field()

    synopsis = scrapy.Field()
    image_url = scrapy.Field()
    url = scrapy.Field()

    # Taken from the subpages
    # description = scrapy.Field()

    # Taken from the links
    episode_details = scrapy.Field()
    summary = scrapy.Field()

# class SubpageProductItem(scrapy.Item):

# class BasicProductItem(scrapy.Item):

#     # series_id as id 
#     _id = scrapy.Field()
#     # series name || movie name
#     name = scrapy.Field() 
#     category_name = scrapy.Field()
#     description = scrapy.Field()



class Series(scrapy.Item):
    _id = scrapy.Field() #series_id
    series_name = scrapy.Field()
    category_name = scrapy.Field()
    image_url = scrapy.Field()
    synopsis = scrapy.Field() # only if main page
    summary = scrapy.Field() #subpage, else child
    latest_episode_url = scrapy.Field()

class Episode(scrapy.Item):
    _id = scrapy.Field() #product_id
    series_id = scrapy.Field() #reference to series
    episode_name = scrapy.Field()
    episode_number = scrapy.Field()
    episode_details = scrapy.Field()
    url = scrapy.Field()
    cover_img_url = scrapy.Field()


class Movie(scrapy.Item):
    _id = scrapy.Field() #product_id
    series_id = scrapy.Field()
    product_name = scrapy.Field() #product name is same as category name
    category_name = scrapy.Field()
    image_url = scrapy.Field()
    url = scrapy.Field()
    synopsis = scrapy.Field() #only if main page
    summary = scrapy.Field() #subpage, else child

