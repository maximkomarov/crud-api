import * as http from 'http';
import * as url from 'url';
import dotenv from 'dotenv';
import Database from './database/Database.ts';
import { validate as uuidValidate } from 'uuid';

const db = new Database();
dotenv.config();
const server = http.createServer((req, res) => {
  const urlparse = url.parse(req.url, true);

  if (urlparse.pathname == '/users' && req.method == 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db.getUsers()));
  }

  if (urlparse.pathname?.startsWith('/users/') && req.method === 'GET') {
    const userId = urlparse.pathname.split('/').pop();
    if (userId && uuidValidate(userId)) {
      const user = db.getUser(userId);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User does not exist' }));
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid uuid' }));
    }
  }

  if (urlparse.pathname == '/users' && req.method == 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const user = JSON.parse(body);
        console.log(user);
        const newlyCreatedUser = db.create(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newlyCreatedUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }

  if (urlparse.pathname?.startsWith('/users/') && req.method == 'PUT') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const userId = urlparse.pathname.split('/').pop();
        if (userId && uuidValidate(userId)) {
          try {
            const user = JSON.parse(body);
            const updatedUser = db.update(user, userId);
            if (!updatedUser) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'User does not exist' }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request body' }));
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid uuid' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }

  if (urlparse.pathname?.startsWith('/users/') && req.method === 'DELETE') {
    const userId = urlparse.pathname.split('/').pop();
    if (userId && uuidValidate(userId)) {
      const user = db.delete(userId);
      if (user) {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User does not exist' }));
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid uuid' }));
    }
  }
});

server.listen(process.env.APPLICATION_PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.APPLICATION_PORT}}`
  );
});
