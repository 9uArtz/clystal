module.exports = {
    tableName: "user",
    primaryKey: "id",
    dsn: "tig_main",
    queries: {
        insert: "INSERT INTO __TABLE_NAME__ ( name,  pass, ctime) VALUES (:name, :pass, NOW())",
        find_by_name : "SELECT * FROM __TABLE_NAME__ WHERE name = :name",
    }
}
