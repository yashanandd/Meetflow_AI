pipeline {
    agent any

    options {
        buildDiscarder(logRotator(
            numToKeepStr: '20',
            artifactNumToKeepStr: '10'
        ))
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_USER = 'yashanandd'
        BACKEND_TAG = "${DOCKER_USER}/meetflow-backend:${BUILD_NUMBER}"
        BACKEND_LATEST = "${DOCKER_USER}/meetflow-backend:latest"
        FRONTEND_TAG = "${DOCKER_USER}/meetflow-frontend:${BUILD_NUMBER}"
        FRONTEND_LATEST = "${DOCKER_USER}/meetflow-frontend:latest"
        DOCKER_CREDS_ID = 'dockerhub-creds1'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Build Information') {
            steps {
                echo 'Gathering environment and build information...'
                bat 'git rev-parse --short HEAD'
                bat 'docker --version'
                bat 'kubectl version --client'
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Executing Backend unit and API tests...'
                dir('backend') {
                    bat '''
                        if not exist .venv ( python -m venv .venv )
                        call .venv\\Scripts\\activate.bat
                        pip install -r requirements.txt
                        pytest
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Building Frontend production bundle...'
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker containers (Tag: Build #${env.BUILD_NUMBER})..."
                bat "docker build -t ${BACKEND_TAG} -t ${BACKEND_LATEST} ./backend"
                bat "docker build -t ${FRONTEND_TAG} -t ${FRONTEND_LATEST} ./frontend"
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Authenticating and pushing immutable Docker images to Docker Hub...'
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDS_ID}",
                        usernameVariable: 'DOCKER_USER_VAR',
                        passwordVariable: 'DOCKER_PASS_VAR'
                    )
                ]) {
                    writeFile file: 'docker_pat.txt', text: env.DOCKER_PASS_VAR
                    bat '''
                        docker logout
                        type docker_pat.txt | docker login -u %DOCKER_USER_VAR% --password-stdin
                        if exist docker_pat.txt del docker_pat.txt
                    '''
                    bat "docker push ${BACKEND_TAG}"
                    bat "docker push ${BACKEND_LATEST}"
                    bat "docker push ${FRONTEND_TAG}"
                    bat "docker push ${FRONTEND_LATEST}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying immutable image tags (Build #${env.BUILD_NUMBER}) via rolling update..."
                bat 'kubectl apply -f k8s/'
                bat "kubectl set image deployment/backend-deployment backend=${BACKEND_TAG}"
                bat "kubectl set image deployment/frontend-deployment frontend=${FRONTEND_TAG}"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes rolling deployment rollout...'
                bat 'kubectl rollout status deployment/backend-deployment'
                bat 'kubectl rollout status deployment/frontend-deployment'
                bat 'kubectl get pods,svc'
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning unused Docker dangling images...'
                bat 'docker image prune -f'
            }
        }
    }

    post {
        success {
            script {
                echo """
==================================================
        DEPLOYMENT SUCCESSFUL - MEETFLOW AI
==================================================
Application    : MeetFlow AI
Build Number   : ${env.BUILD_NUMBER}
Backend Image  : ${BACKEND_TAG}
Frontend Image : ${FRONTEND_TAG}
K8s Namespace  : default
Status         : Healthy & Operational
==================================================
"""
            }
        }

        failure {
            echo 'Deployment failed! Triggering automatic Kubernetes rollback...'
            bat 'kubectl rollout undo deployment/backend-deployment'
            bat 'kubectl rollout undo deployment/frontend-deployment'
            bat 'kubectl rollout status deployment/backend-deployment'
            bat 'kubectl rollout status deployment/frontend-deployment'
            echo 'Automatic Rollback Completed.'
        }

        always {
            echo 'Performing post-build cleanup...'
            bat 'docker logout'
            bat 'if exist docker_pat.txt del docker_pat.txt'
        }
    }
}
