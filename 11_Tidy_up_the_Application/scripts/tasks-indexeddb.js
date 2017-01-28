storageEngine = function() {
	var database;
	var objectStores;
	return {
		init : function(successCallback, errorCallback) {
			if (window.indexedDB) {
				var request = indexedDB.open(window.location.hostname+'DB');
				request.onsuccess = function(event) {
					database = request.result;
					successCallback(null);
				}
				request.onerror = function(event) {
					errorCallback('storage_not_initalized', 'It is not possible to initialized storage');
				}
			} else {
				errorCallback('storage_api_not_supported', 'The web storage api is not supported');
			}			
		},
		initObjectStore  : function(type, successCallback, errorCallback) {
	    	if (!database) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			}
	    	var exists = false;
	    	$.each(database.objectStoreNames, function(i, v) {
	    		  if (v == type) {
	    			  exists = true;
	    		  }
	    	});
	    	if (exists) {
	    		successCallback(null);
	    	} else {
		    	var version = database.version+1;
		    	database.close();
		    	var request = indexedDB.open(window.location.hostname+'DB', version);
				request.onsuccess = function(event) {
					successCallback(null);
				}
				request.onerror = function(event) {
					errorCallback('storage_not_initalized', 'It is not possible to initialized storage');
				}
				request.onupgradeneeded = function(event) {
					database = event.target.result;
			    	var objectStore = database.createObjectStore(type, { keyPath: "id", autoIncrement: true });
					
				}
	    	}
	    },
	    save : function(type, obj, successCallback, errorCallback) { 
	    	if (!database) {
	    		errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
	    	}
	    	if (!obj.id) {
	    		delete obj.id ;
	    	} else {
	    		obj.id = parseInt(obj.id)
	    	}
	    	var tx = database.transaction([type], "readwrite");
	    	tx.oncomplete = function(event) {
	    		successCallback(obj);
	    	};
	    	tx.onerror = function(event) {
	    		errorCallback('transaction_error', 'It is not possible to store the object');
	    	};
	    	var objectStore = tx.objectStore(type);
	    	var request = objectStore.put(obj);
	    	request.onsuccess = function(event) {
	    		obj.id = event.target.result
	    	}
	    	request.onerror = function(event) {
	    		errorCallback('object_not_stored', 'It is not possible to store the object');
	    	};
	    },
	    findAll : function(type, successCallback, errorCallback) { 
	    	if (!database) {
	    		errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
	    	}
	    	var result = [];
	    	var tx = database.transaction(type);
	    	var objectStore = tx.objectStore(type);
	    	objectStore.openCursor().onsuccess = function(event) {
	    		var cursor = event.target.result;
	    		if (cursor) {
	    			result.push(cursor.value);
	    			cursor.continue();
	    		} else {
	    			successCallback(result);
	    		}
	    	};				
	    },
	    delete : function(type, id, successCallback, errorCallback) { 
	    	var obj = {};
	    	obj.id = id;
	    	var tx = database.transaction([type], "readwrite");
	    	tx.oncomplete = function(event) {
	    		successCallback(id);
	    	};
	    	tx.onerror = function(event) {
	    		console.log(event);
	    		errorCallback('transaction_error', 'It is not possible to store the object');
	    	};
	    	var objectStore = tx.objectStore(type);				
	    	var request = objectStore.delete(id);
	    	request.onsuccess = function(event) {				
	    	}
	    	request.onerror = function(event) {
	    		errorCallback('object_not_stored', 'It is not possible to delete the object');
	    	};
	    },
	    findByProperty : function(type, propertyName, propertyValue, successCallback, errorCallback) {
	    	if (!database) {
	    		errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
	    	}
	    	var result = [];
	    	var tx = database.transaction(type);
	    	var objectStore = tx.objectStore(type);
	    	objectStore.openCursor().onsuccess = function(event) {
	    		var cursor = event.target.result;
	    		if (cursor) {
	    			if (cursor.value[propertyName] == propertyValue) {
	    				result.push(cursor.value);
	    			}
	    			cursor.continue();
	    		} else {
	    			successCallback(result);
	    		}
	    	};
	    },
		findById : function (type, id, successCallback, errorCallback)	{
			if (!database) {
				errorCallback('storage_api_not_initialized', 'The storage engine has not been initialized');
			}
			var tx = database.transaction([type]);
			var objectStore = tx.objectStore(type);
			var request = objectStore.get(id);
				request.onsuccess = function(event) {
				successCallback(event.target.result);
			}
			request.onerror = function(event) {
				errorCallback('object_not_stored', 'It is not possible to locate the requested object');
			};				
		}
	}
}();
