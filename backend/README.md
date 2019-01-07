### How to run backend?
  - Navigate to backend directory in cmd
  - Install required dependencies using npm install
  - Import the DB structures and data from the file SQLDBDump.sql
  - Run back end using npm start

How can I change port, if 5001 port is occupied?
  - Open index.js file in the backend directory
  - Change '5001' to currently available port number in line 147 (app.listen(5001))
