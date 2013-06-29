module.exports = {
    tableName: "user",
    primaryKey: "id",
    dsn: "tig_main",
    queries: {
        insert: "INSERT INTO __TABLE_NAME__ ( name,  pass, ctime) VALUES (:name, :pass, NOW())"
    }
}
