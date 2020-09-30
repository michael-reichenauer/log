const azure = require('azure-storage');
// Reference to the uuid package which helps us to create 
// unique identifiers for our PartitionKey
const { v4: uuidv4 } = require('uuid');

// The TableService is used to send requests to the database
const tableService = azure.createTableService();
const baseTableName = 'logs'
const entGen = azure.TableUtilities.entityGenerator;
const partitionKeyName = 'log'
const indexKeyName = 'index'

const maxBatchSize = 100

let allLogItems = {}
// let defaultLogId = new Date().toISOString()
// let defaultLastTime = new Date().toISOString()

exports.getLogs = async (context, clientPrincipal, start, count) => {
    const tableName = baseTableName + clientPrincipal.userId

    let total = 0
    let indexTime = ''
    let indexTimestamp = ''
    try {
        const entity = await retrieveEntity(tableName, partitionKeyName, indexKeyName)
        total = entity.index
        indexTime = entity.time
        indexTimestamp = entity.Timestamp
        context.log(`got total: ${total}`)
        //context.log(`total entity: ${JSON.stringify(entity)}`)
    } catch (err) {
        // Nothing to do yet
        context.log(`got no total yet, error: ${err}`)
    }

    if (start >= total) {
        start = total
    }

    if (count < 0) {
        // requesting latest items, moving start to end of items
        count = -count
        let newStart = total - count
        if (newStart < start) {
            // Ensure new start is not less then requested start
            newStart = start
        }
        start = newStart
    }

    if (start + count > total) {
        count = total - start
    }
    context.log(`Getting: start: ${start}, count: ${count} of total: ${total}`)

    if (count === 0 || total === 0) {
        context.log(`No items to return: count: ${count}, total: ${total}`)
        return {
            id: indexTime,
            lastTime: indexTimestamp,
            start: start,
            items: [],
            total: total
        }
    }


    // Copy the requested items
    const continuationToken = null
    const startIndex = indexRowKey(start)
    const endIndex = indexRowKey(start + count)
    context.log(`query: ${startIndex} to < ${endIndex} of total: ${total}`)
    var tableQuery = new azure.TableQuery()
        .where('RowKey >= ?string? && RowKey < ?string?', startIndex, endIndex);

    //context.log(`query: '${combinedFilter.toQueryObject()}'`)
    const items = await queryEntities(tableName, tableQuery, continuationToken)
    context.log(`queried: ${items.length} of total: ${total}`)
    // context.log(`items: ${JSON.stringify(items)}`)

    return {
        id: indexTime,
        lastTime: indexTimestamp,
        start: start, // Start might have been moved (if larger than total or count was negative)
        items: items,
        total: total
    }
}

exports.addLogs = async (context, clientPrincipal, items, generalProperties) => {
    if (!items || items.length === 0) {
        // Nothing to add
        return
    }
    const tableName = baseTableName + clientPrincipal.userId

    let nextIndex = 0
    let indexTime = new Date()
    try {
        const entity = await retrieveEntity(tableName, partitionKeyName, indexKeyName)
        nextIndex = entity.index
        indexTime = entity.time
        context.log(`got index: ${nextIndex}`)
    } catch (err) {
        context.log(`got no index yet, error: ${err}`)
        await createTableIfNotExists(tableName)
    }

    let startIndex = 0
    do {
        const batchSize = Math.min(items.length - startIndex, maxBatchSize - 1)
        //context.log(`batch: index before:  start: ${startIndex}, size:${batchSize}, next: ${nextIndex},`)
        await insertBatch(context, tableName, items, startIndex, nextIndex, indexTime, batchSize, generalProperties)

        nextIndex = nextIndex + batchSize
        startIndex = startIndex + batchSize
        // context.log(`batch: index after: start: ${startIndex}, next: ${nextIndex},`)
    } while (startIndex < items.length)

}

async function insertBatch(context, tableName, items, startIndex, nextIndex, indexTime, batchSize, generalProperties) {
    const batch = new azure.TableBatch()

    const indexItem = {
        PartitionKey: entGen.String(partitionKeyName),
        RowKey: entGen.String(indexKeyName),
        index: entGen.Int32(nextIndex + batchSize),
        time: entGen.String(indexTime)
    }
    batch.insertOrReplaceEntity(indexItem)
    //context.log(`inserting index item: ${JSON.stringify(indexItem)}`)
    //context.log(`insertBatch before:  start: ${startIndex}, size:${batchSize}, next: ${nextIndex},`)

    for (let i = 0; i < batchSize; i++) {
        const item = items[i + startIndex]
        // context.log(`item: ${i + startIndex} at index: ${nextIndex + i}`)
        if (item.properties) {
            item.properties = JSON.stringify(item.properties.concat(generalProperties))
        } else {
            item.properties = JSON.stringify(generalProperties)
        }
        item.PartitionKey = entGen.String(partitionKeyName)
        item.RowKey = entGen.String(indexRowKey(nextIndex + i))
        item.index = nextIndex + i

        ///context.log(`inserting: ${JSON.stringify(item)}`)
        batch.insertEntity(item)
    }

    await executeBatch(tableName, batch)
}

exports.clearLogs = (clientPrincipal) => {
    let userLogItems = allLogItems[clientPrincipal.userId]
    userLogItems.logItems = []
    userLogItems.logId = new Date().toISOString()
    userLogItems.lastTime = new Date().toISOString()
    allLogItems[clientPrincipal.userId] = userLogItems
}


function createTableIfNotExists(tableName) {
    return new Promise(function (resolve, reject) {
        tableService.createTableIfNotExists(tableName, function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    });
}

function insertEntity(tableName, item) {
    return new Promise(function (resolve, reject) {
        tableService.insertEntity(tableName, item, function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
}

function executeBatch(tableName, batch) {
    return new Promise(function (resolve, reject) {
        tableService.executeBatch(tableName, batch, function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
}


function retrieveEntity(tableName, partitionKey, rowKey) {
    return new Promise(function (resolve, reject) {
        tableService.retrieveEntity(tableName, partitionKey, rowKey, function (error, result, response) {
            if (error) {
                reject(error);
            }
            else {
                resolve(response.body);
            }
        })
    })
}

function queryEntities(tableName, tableQuery, continuationToken) {
    return new Promise(function (resolve, reject) {
        tableService.queryEntities(tableName, tableQuery, continuationToken, function (error, result, response) {
            if (error) {
                reject(error);
            }
            else {
                resolve(response.body.value);
            }
        })
    })
}

function indexRowKey(index) {
    return pad(index, 10)
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}