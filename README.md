# Booker-BookManager

Welcome to Booker, a simple books library manager to keep track of the book you are reading/finished reading.

I imported the main dataset of books and covers info (25000+ book) from Kaggle, cleaned the csv file to my preference (link to original dataset: https://www.kaggle.com/datasets/lukaanicin/book-covers-dataset/)

##Stack:
  What i've used to build this app:
  -nodeJS / ExpressJs
  -EJS for rendering
  -PostgreSQL for data storage and manipulation

  So make sure you have those installed on your machine, you can download them easily (google search).


After you clone this repo locally, you should have this look:

![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/646c5f68-da0d-41fc-912f-0bc3dc76f103)
I'm using VScode.

#FIRST: Database Set-up

I'm using PostgreSQL with pgAdmin4, supposing you have those on your machine, your next steps are:

##1.create database 

![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/14b2eeab-3211-46f7-92db-9b9195284722)
You can name the database whatever you want, just make sure you use the same name when setting up the connection to the DB using NodeJS.

##2.Create BOOKS and NOTES tables

In the query.sql file you will find the SQL queries you need to create the tables, don't change anything about them as that might lead to some problems we don't want.

![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/cd108e36-3f25-46fc-9495-465f16fdf8e5)

After you create those Tables, we want to import the main-data.csv into your **books** table.

Steps:
  Click on import/Export Data 
  ![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/e433ef05-9598-4b1e-8070-dc294a5a1263)

  Make sure you set the **File name** to the path where you're **main_dataset.csv** file is located.
  ![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/3a12c105-ea88-4ce3-a5a2-0733d0008ab4)

  You're **options** should look like this
  ![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/9c9ec6a0-d57d-4e9b-89c7-fed2bb9e4d00)

  Next we just need to set the columns we want to import (name,author,image,img_paths)
  ![image](https://github.com/0xNoSystem/Booker-BookManager/assets/141743613/7508cc5d-db77-43cb-89e3-b5532b67d9aa)










