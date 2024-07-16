# Transferior backend
  Application for the transfer service for users as well as for providers.   


## AWS Console
  Email: transferior@gmail.com   
  Password: Transferior2022!   


## Access of EC2 instance
  Command: ssh -i transferior.pem ec2-user@ec2-54-82-69-225.compute-1.amazonaws.com   
  User: ec2-user   
  Root user password: Transferior2022!   


## RDS credentials
  Host: transferior.copkkqo9o6ez.us-east-1.rds.amazonaws.com   
  User: postgres   
  Password: Transferior2022!   
  Database: transferior   
  Port: 5432   


## Branch hierarchy
  master -> staging -> other developer branches ( like dev_jay, dev_abhishek )   
  Live server code is running on **master** branch code.   


## Upload code and restart node server steps
  You don't have to use **Filezilla** to upload the code manually. All code has been manage by version control system **Git**.   

  1. First commit your branch code and merge with **staging** and then staging branch code with **master** branch.   
  2. Connect to EC2 server using above **[SSH command]** (#access-of-EC2-instance).   
  3. Goto **Transferior-backend** directory on server.   
  4. User **./restart.sh** command.   
  5. Command with automatically pull all the code from **master** branch, install all **NPM modules** and then it will restart the **PM2 server** of the application.   