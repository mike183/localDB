/*
  localDB © 2012 Michael Donaldson
  Simple localStorage Database
  Version: 0.2.1
  
  License: MIT (http://opensource.org/licenses/MIT)
*/

function localdb(db)
{
  
  //Check if database already exists, if it doesn't create it
  if(localStorage[db] === undefined){
    localStorage[db] = JSON.stringify({});
  }
  
  //Load database
  var database = JSON.parse(localStorage[db]);
  
  //Define a save function that will save changes made to the database
  var save = function(database){
    localStorage[db] = JSON.stringify(database);
    return true;
  };
  
  var localdb = {

    /*
      Delete Database
    */
    deleteDatabase: function(dbname){
      
      if(localStorage[dbname] !== undefined){
        delete localStorage[dbname];
        return true;
      } else {
        console.error('A database with the name "'+dbname+'" could not be found');
        return false;
      }

    },
    
    /*
      Create Table
    */
    createTable: function(table){
      
      if(database[table] === undefined){
        database[table] = {
          'totalrows': 0,
          'autoinc': 1,
          'rows': {}
        };
        save(database);
      } else {
        console.error('A table with the name "'+table+'" already exists');
        return false;
      }
      
    },
    
    /*
      Delete Table
    */
    dropTable: function(table){
      
      if(database[table] !== undefined){
        delete database[table];
        save(database);
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Get Table Meta
    */
    tableMeta: function(table){
      
      if(database[table] !== undefined){
        var meta = {
          totalrows: database[table].totalrows,
          autoinc: database[table].autoinc
        };
        return meta;
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Insert Data
    */
    insert: function(table, data){
      
      if(database[table] === undefined){
        localdb.createTable(table);
      }
      
      autoinc = database[table].autoinc;
      data.ID = autoinc;
      database[table].rows[autoinc] = data;
      database[table].autoinc += 1;
      database[table].totalrows += 1;
      save(database);
      
    },
    
    /*
      Update Data
    */
    update: function(table, data, where){
      
      if(database[table] !== undefined){
        var rows = database[table].rows;
        for(row in rows){
          if(rows[row] !== null){
            //Default value for stop change
            var stopchange = 0;
            
            //Runs through where criteria to see if the current row is a match
            //if it isn't it changes stopchange to 1 to prevent the update 
            //running on this row
            for(i in where){
              if(database[table].rows[row][i] != where[i]){
                stopchange = 1;
              }
            }
            
            //If stopchange is still 0, update the row
            if(stopchange == 0){
              for(i in data){
                database[table].rows[row][i] = data[i];
              }
              //Updates are finished, save changes
              save(database);
            }
          }
        }
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Update Data By ID
    */
    updateById: function(table, data, id){
      
      if(database[table] !== undefined){
        for(i in data){
          database[table].rows[id][i] = data[i];
        }
        save(database);
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Delete Data
    */
    remove: function(table, where){
      
      if(database[table] !== undefined){
        var rows = database[table].rows;
        for(row in rows){
          if(rows[row] != null){
            //Default value for stop delete
            var stopdelete = 0;
            
            //Runs through where criteria to see if the current row is a match
            //if it isn't it changes stopdelete to 1 to prevent the row from 
            //being deleted
            for(i in where){
              if(database[table].rows[row][i] != where[i]){
                stopdelete = 1;
              }
            }
            
            //If stopdelete is still 0, delete the row
            if(stopdelete == 0){
              delete database[table].rows[row];
              save(database);
            }
          }
        }
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Delete Data By ID
    */
    removeById: function(table, id){
      
      if(database[table] !== undefined){
        if(database[table].rows[id] !== null){
          delete database[table].rows[id];
          save(database);
        } else {
          console.error('The specified row could not be found');
          return false;
        }
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Find Data
    */
    find: function(table, where, limit, offset, type){
      
      if(!type){
        var type = 'AND';
      }
      
      if(database[table] !== undefined){
        var rows = database[table].rows;
        var results = [];
        
        //Check if there are any where parameters
        var noparams = 1;
        for(p in where){
          noparams = 0;
          break;
        }
        
        //Decide what to do based on if there are any parameters or not
        if(noparams == 0)
        {
          for(row in rows){
            //Is a match?
            var ismatch = 0;
            
            //Decide which method is used, AND or OR
            if(type.toUpperCase() == 'AND'){
              for(i in where){
                if(database[table].rows[row][i] == where[i]){
                  ismatch = 1;
                } else {
                  ismatch = 0;
                  break;
                }
              }
            } else if(type.toUpperCase() == 'OR') {
              for(i in where){
                if(database[table].rows[row][i] == where[i]){
                  ismatch = 1;
                  break;
                }
              }
            }
            
            if(ismatch == 1){
              results.push(database[table].rows[row]);
            }
          }
        } else {  
          for(row in rows){
            results.push(database[table].rows[row]);
          }
        }
        
        if(!offset){
          var offset = 0;
        } else if(typeof(offset) != 'number'){
          offset = 0;
        }
        
        if(typeof(limit) == 'number'){
          if(limit > parseInt(0)){
            return results.slice(offset, limit+offset);
          } else {
            return results.slice(offset);
          }
        } else {
          return results;
        }
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Find Data By ID
    */
    findById: function(table, id){
      
      if(database[table] !== undefined){
        if(database[table].rows[id] !== undefined){
          return database[table].rows[id];
        } else {
          console.error('The requested record could not be found');
          return false;
        }
      } else {
        console.error('A table with the name "'+table+'" could not be found');
        return false;
      }
      
    },
    
    /*
      Database Exists
    */
    dbExists: function(thedb){
      
      if(localStorage[thedb] !== undefined){
        return true;
      } else {
        return false;
      }
      
    },
    
    /*
      Table Exists
    */
    tableExists: function(table){
      
      if(database[table] !== undefined){
        return true;
      } else {
        return false;
      }
      
    },
    
    /*
      Export JSON
    */
    exportData: function(table){
      
      if(table){
        if(database[table] !== undefined){
          return JSON.stringify(database[table]);
        } else {
          console.error('Table not found');
          return false;
        }
      } else {
        return JSON.stringify(database);
      }
      
    }
    
  };
  
  return localdb;
}