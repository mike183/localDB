
#localDB - A Simple localStorage Database

localDB is a simple database layer for localStorage.

##Table of Contents:

* [Overview](#overview)
* [Installation](#installation)
* [localDB Anatomy](#localdb-anatomy)
* [Loading a Database](#loading-a-database)
* [Deleting a Database](#deleting-a-database)
* [Creating a Table](#creating-a-table)
* [Deleting a Table](#deleting-a-table)
* [Getting Table Meta Data](#getting-table-meta-data)
* [Inserting Data](#inserting-data)
* [Updating Data](#updating-data)
* [Removing Data](#removing-data)
* [Finding Data](#finding-data)
* [Checking a Database Exists](#checking-a-database-exists)
* [Checking a Table Exists](#checking-a-table-exists)
* [Exporting Data](#exporting-data)

<h2 id="overview">Overview</h2>
localDB is a very simple database for localStorage. It allows you to harnes the power of the browsers localStorage so that you can still store data even when your user is using an offline application. localDB is completely standalone and has absolutely no dependencies other than your users browser supporting localStorage ;)

One thing to bear in mind when using localStorage is that it has a limit of 5MB before the browser warns the user.

<h2 id="installation">Installation</h2>
To install localDB all you need to do is include the javascript in your page. The line should look something like the one below:

`<script type="text/javascript" src="localdb.min.js"></script>`

<h2 id="anatomy">localDB Anatomy</h2>
In this section I would like to spend some time explaining how the databases created by localDB are structured and what to expect in terms of errors if a function fails for some reason.

***Structure:***  
A database is stored as a key in localStorage, this key contains a JSON encoded string of an object which is the database. The structure of the database is displayed below:

db_name  
&nbsp;&nbsp;&nbsp;|---table_name  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---totalrows *(variable)*  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---autoinc *(variable)*  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|---rows *(array)*

***Return values:***  
If a function fails a some point it will always return false, most functions will also output an error message into the browsers console in order to give you a description of exactly what went wrong in an attempt to help you what the problem was. Return values are noted next to each of the functions further down these docs.

<h2 id="loaddb">Loading a Database</h2>
After you have included the javascript in your page, you will now need to load a database. To do this you will need to call a new instance of localdb() with the first and only parameter being the name of the database you want to load. If the database exists it will be loaded into memory, if the database doesn't exist yet then it will be created and then loaded into memory. The line of code should look something like this:

`var db = new localdb('dbname');`

**Example:** 

`var db = new localdb('foo');`

**Returns:**  
None

<h2 id="deletedb">Deleting a Database</h2>
If at any point you would like to delete a database, you can do so using the following function. If the database you are trying to delete doesn't exist, an error will be displayed in the browsers error console and the function will return false. The code to delete a database would like something like this:

`db.deleteDatabase('database_name');`

**Example:**

`db.deleteDatabase('foo');`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)

<h2 id="createtable">Creating a Table</h2>
Now that you have loaded a database into memory. Let's create a table. localDB is a schemaless database system, this means that when creating a table in localDB you don't need to worry about defining any columns, all you need to define is the name of the table that you would like to create. To create a table in the database we just loaded, it would look something like this:

`db.createTable('table_name');`

**Example:**

`db.createTable('users');`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)

<h2 id="droptable">Deleting a Table</h2>
Deleting a table in localDB is simple, you simply need to enter the name of the table you would like to delete as the first parameter in the dropTable() function like so:

`db.dropTable('table_name');`

**Example:**

`db.dropTable('users');`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)

<h2 id="tablemeta">Getting Table Meta Data</h2>
localDB stores a couple of pieces of information that you might want to use every so often like the total number of rows in a table and the current auto increment value of the table. To get this information, call the tableMeta() method with the first and only parameter being the name of the table you want to retrieve the meta information for. The code would look something like this:

`var meta = db.tableMeta('table_name');`

**Example:**

`var meta = db.tableMeta('users');`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)

<h2 id="inserting">Inserting Data</h2>
When it comes to inserting data into the database, as I said earlier localDB is a schemaless database system which means when you are inserting data into the column you won't need to worry about if the column you are trying to insert data into has been defined or not as each row of data in the database has it's own set of "columns". This means that some rows in the database could possibly have more "columns" than another row in the same table.

In order to insert some data into the database you need to provide the name of the table and the data you would like to insert into the first and second parameters respectively of the insert() function as follows:

`db.insert('table_name', data_object);`

**Example:** 

`db.insert('users', {'username': 'johnsmith', 'firstname': 'John', 'lastname': 'Smith'});`

**Returns:**  
*Success:* true

<h2 id="updating">Updating Data</h2>
There are 2 methods for updating data in localDB. These methods are **update()** and **updateById()**. 

***update(table_name, data_object, where_object)***

The update() method has 3 parameters, going from first to last they are: **table**, **data** and **where**. The code for updating some data in the database using the update() method would look something like this:

`db.update('users', {'username': 'smithy576'}, {'username': 'johnsmith'});`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)  
&nbsp;

***updateById(table_name, data_object, id)***

The updateById() method also has 3 parameters, going from first to last they are: **table**, **data** and **id**. This function is only really any use when you know the ID of the row you are trying to update. The code for updating some data using the updateById() method would look something like this:

`db.updateById('users', {'username': 'smithy576'}, 1);`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)

<h2 id="removing">Removing Data</h2>
Similar to updating above, there are 2 methods for removing data in localDB. These methods are **remove()** and **removeById()**. 

***remove(table_name, where_object)***

The remove() method has 2 parameters, the first one being **table** and the second being **where**. The code for removing some data from the database using the remove() method would look something like this:

`db.remove('users', {'username': 'smithy576'});`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)  
&nbsp;

***removeById(table_name, id)***

The removeById() method also has 2 parameters, the first one being **table** and the second one being **id**. This function is only really any use when you know the ID of the row you are trying to remove. The code for removing some data using the removeById() method would look something like this:

`db.removeById('users', 1);`

**Returns:**  
*Success:* true  
*Error:* false with error message (console)

<h2 id="finding">Finding Data</h2>
Just like updating and deleting, there are 2 methods at your disposal for finding data in localDB. These methods are **find()** and **findById()**. 

***find(table_name, where_object, limit, offset, type)***

The find() method has 5 parameters, from left to right they are as follows: **table_name**, **where**, **limit**, **offset**, **type**. I will explain these parameters a little more below:

*table_name* - Simple, it's the name of the table that you want to search in  
*where (optional)* - An object containing the where criteria, check below for an example. If omitted, the search will match all rows  
*limit (optional)* - The maximum number of items you want to be returned  
*offset (optional)* - The offset of the returned results  
*type (optional)* - This is the type of search you want to run. Possible values are AND and OR. If omitted this defaults to AND.

The code for finding some data in the database using the find() method would look something like this:

**Example 1:**

`var results = db.find('users', {'username': 'smithy576'});`  
*English: Find all users where their username is smithy576*

**Example 2:**

`var results = db.find('users', {'username': 'smithy576', 'firstname': 'Jason'}, 1, 0, 'OR');`  
*English: Find one user where either their username is smithy576 or their first name is Jason*

**Example 3:**

`var results = db.find('users', {'title': 'Mr', 'lastname': 'Williams'}, 5, 0, 'AND');`  
*English: Find 5 users where their title is Mr and their last name is Williams*

**Returns:**  
*Success:* Array  
*Error:* false with error message (console)  
&nbsp;

***findById(table_name, id)***

The findById() method has 2 parameters, the first one being **table** and the second one being **id**. This function is only really any use when you know the ID of the row you are trying to find. The code for finding some data using the findById() method would look something like this:

`db.findById('users', 1);`

**Returns:**  
*Success:* Array  
*Error:* false with error message (console)

<h2 id="dbexists">Checking a Database Exists</h2>
You can use the dbExists() method to check if a certain database already exists or not. This function will return true if the database exists and false if it doesn't. You can use the function like so:

`var dbexists = db.dbExists('dbname');`

**Example:**

`var dbexists = db.dbExists('bar');`

**Returns:**  
*Success:* true  
*Error:* false

<h2 id="tableexists">Checking a Table Exists</h2>
You can use the tableExists() method to check if a certain table already exists or not in the currently loaded database. This function will return true if the table exists and false if it doesn't. You can use the function like so:

`var tableexists = db.tableExists('table_name');`

**Example:**

`var tableexists = db.tableExists('users');`

**Returns:**  
*Success:* true  
*Error:* false

<h2 id="exporting">Exporting Data</h2>
localDB allows you to export either the whole database or a certain table from the database using the exportData() method. The exportData() method has 1 parameter which is **table** and it is optional. If the table parameter is supplied the required table will be exported as a JSON string from the currently loaded database otherwise if the parameter is omitted the entire currently loaded database will be exported as a JSON string.

`var json = db.exportData('table_name');`

**Example 1:**

`var database = db.exportData();`

**Example 2:**

`var table = db.exportData('users');`

**Returns:**  
*Success:* JSON  
*Error:* false with error message (console)