# **CI/CD Pipeline Using Jenkins → Deploying to EC2 (Nginx)**

This project demonstrates how to build a **complete CI/CD pipeline** using:

-   **Jenkins**
    
-   **GitHub Repository**
    
-   **GitHub Webhooks**
    
-   **Two EC2 Instances**
    
    -   Jenkins Server (public)
        
    -   Application Server (public/private)
        
-   **Nginx Web Server**
    
-   **SSH Key-based Deployment**
    

This pipeline automatically:

1.  Pulls latest code from GitHub
    
2.  Builds the project (if needed)
    
3.  Deploys files to EC2 Application Server
    
4.  Serves the application using Nginx
    

----------

#  **Architecture Overview**

This architecture shows how:

-   GitHub pushes changes → triggers Jenkins via webhook
    
-   Jenkins pulls code → deploys to EC2 application server
    
-   Nginx hosts and serves your website files
    

----------

#  **EC2 Setup**

## **1. Launch Two EC2 Instances**

### **Instance 1: Jenkins Server (Public)**

-   Ubuntu AMI
    
-   Open ports: **22**, **8080**, **80**
    
-   Install Jenkins
    
-   Install Git
    

### **Instance 2: Application Server**

-   Ubuntu AMI
    
-   Install Nginx
    
-   Open ports: **22**, **80**
    
-   Host HTML, CSS, JS files at `/var/www/html`
    

----------

#  **2. Configure SSH Key-Based Authentication**

On Jenkins server:

`sudo su - jenkins
ssh-keygen -t rsa -b 4096 -f ~/.ssh/jen_key.pem` 

Copy public key to application server:

`ssh-copy-id -i ~/.ssh/jen_key.pem.pub ubuntu@<APP_SERVER_IP>` 

Give correct permissions:

`chmod 600 ~/.ssh/jen_key.pem` 

----------

#  **3. Install & Configure Jenkins**

Install Jenkins:

`sudo apt update
sudo apt install openjdk-17-jdk -y
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null
sudo apt-get update
sudo apt-get install jenkins -y` 

Start Jenkins:

`sudo systemctl enable jenkins
sudo systemctl start jenkins` 

Open Jenkins dashboard at:

`http://<JENKINS_PUBLICIP>:8080` 

Upload Jenkins plugins:

-   Git plugin
    
-   Pipeline plugin
    

----------

#  **4. Create GitHub Webhook**

Go to the repository → **Settings → Webhooks**

Add:

`http://<JENKINS_PUBLIC_IP>:8080/github-webhook/` 

Select:

-   **Content type** → application/json
    
-   Events → _Just push events_
    

Now GitHub will notify Jenkins when code changes.

----------

#  **5. Jenkins Pipeline (Jenkinsfile)**

A sample working Jenkinsfile:

pipeline {
    agent any

    environment {
        EC2_IP = credentials('ec2_ip')
        EC2_USER = 'ubuntu'
        SSH_KEY = credentials('ec2_ssh_key')
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Akshitha-Geneicloud/CICD-pipeline.git'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                echo "Deploying files to EC2..."

                ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_IP "sudo rm -rf /var/www/html/*"

                scp -o StrictHostKeyChecking=no -i $SSH_KEY -r * $EC2_USER@$EC2_IP:/var/www/html/

                echo "Deployment Successful!"
                '''
            }
        }
    }
}
----------

# **6. Nginx Configuration**

Edit default file:

`sudo nano /etc/nginx/sites-available/default` 

Use this:

`server { listen  80 default_server; listen [::]:80 default_server; root /var/www/html; index chat.html; server_name _; location / { try_files  $uri  $uri/ =404;
    }
}` 

Test & restart:

`sudo nginx -t
sudo systemctl restart nginx` 

----------

# **7. How Deployment Works**

1.  First, push code to GitHub
    
2.  GitHub webhook triggers Jenkins
    
3.  Jenkins pulls updated files
    
4.  Jenkins securely connects to Application EC2
    
5.  Deletes old content
    
6.  Uploads new HTML/CSS/JS files
    
7.  Nginx instantly serves the updated website
    

----------

# **8. Final Result**

The website is now automatically deployed when you push code to GitHub!

Open:

`http://<APPLICATION_SERVER_PUBLIC_IP>`
