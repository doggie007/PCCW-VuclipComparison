# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import pymongo
from itemadapter import ItemAdapter
# from scrapy.utils.project import get_project_settings
import logging

# settings = get_project_settings()

class MongoDBPipeline:

    collection_name = 'scrapy_items'

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'items')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db[spider.settings.get('COLLECTION_NAME')].insert_one(ItemAdapter(item).asdict())
        return item

    """
    def __init__(self):
        connection = pymongo.MongoClient(
            settings.get('MONGO_HOST'),
            settings.get('MONGO_PORT')
        )
        self.db = connection[settings.get('MONGO_DB_NAME')]
        self.collection = self.db[settings['MONGO_COLLECTION_NAME']]

    def process_item(self, item, spider):
        #Check title is not empty
        if item["title"] == None:
            logging.debug("Title is null")
        else:
            # #Check not a duplicate
            # duplicate_check = self.collection.count_documents({'title': item['title']})
            # if duplicate_check == 0:
            #     #No duplicates
            #     self.collection.insert_one(ItemAdapter(item).asdict())
            #     logging.debug("Successfully added item to DB")
            # else:
            #     logging.debug("Same title exists!")
            self.collection.insert_one(ItemAdapter(item).asdict())
        return item
    """