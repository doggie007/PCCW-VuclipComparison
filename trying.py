import pymongo
from pymongo import MongoClient
from time import time

client = pymongo.MongoClient("mongodb+srv://admin:fZ3XJTxZ1HxRKTWH@viustarting.jqgssgy.mongodb.net/?retryWrites=true&w=majority")
db = client["Viu"]
collection = db["Production"]
start = time()
cursor = collection.find({})
print(time()-start)