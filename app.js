const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
let db = null;

const dbPath = path.join(__dirname, "todoApplication.db");
const inidbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Serever is running at http://localhost/3000");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};
inidbServer();

///API1

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q } = request.query;
  const statusQuery = () => {
    return priority === undefined && search_q === undefined;
  };
  const priorityQuery = () => {
    return status === undefined && search_q === undefined;
  };
  const priorityAndStatusQuery = () => {
    return search_q === undefined;
  };
  const searchQuery = () => {
    return search_q !== undefined;
  };
  let sql1 = null;
  switch (true) {
    case statusQuery:
      sql1 = `select * from todo where status =${status};`;
      break;
    case priorityQuery:
      sql1 = `select * from todo where priority=${priority};`;
      break;
    case priorityAndStatusQuery:
      sql1 = `select * from todo  where status=${status} and priority=${priority};`;
      break;
    case searchQuery:
      sql1 = `select * from todo where todo like %${search_q}%;`;

      break;
  }

  dbObject = await db.all(sql1);
  response.send(dbObject);
});

///API2

app.get("todo/:todoId", async (request, response) => {
  const { id } = request.params;
  const sql2 = `select * from 
    todo where id=${id};`;
  const dbObject2 = await db.get(sql);
  response.send(dbObject2);
});

///API3

app.post("/todos", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const sql3 = `insert into todo
    (id,todo,priority,status)
    values(${id},${todo},${priority},${status})
    `;
  await db.run(sql3);
  response.send("Todo Successfully");
});

///API4

app.put("/todos/:todoId/", async (request, response) => {
  const { id } = request.params;
  const { status, priority, todo } = request.query;
  const statusQueay = () => {
    return priority === undefined && todo === undefined;
  };
  const priorityQuery = () => {
    return status === undefined && todo === undefined;
  };

  const todoQuery = () => {
    return status === undefined && priority === undefined;
  };
  let sqlQuery = null;
  switch (true) {
    case statusQueay:
      sqlQuery = `update todo set status=${status};`;
      await db.run(sqlQuery);
      response.send("Status Updated");

      break;

    case priorityQuery:
      sqlQuery = `update todo set priority=${priority};`;
      await db.run(sqlQuery);
      response.send("Priority Updated");
      break;

    case todoQuery:
      sqlQuery = `update todo set todo=${role};`;
      await db.run(sqlQuery);
      response.send("Todo Updated");

      break;
  }
});

///API DELETE

module.exports = app;

app.delete("/todos/:todoId/", async (request, response) => {
  const { id } = request.params;
  const sqlDelQuery = `delete from table todo where id=${id}`;
  await db.run(sqlDelQuery);
  response.send("Todo Deleted");
});
