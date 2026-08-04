pipeline {
    agent any

    environment {
        DOCKER_USER = 'yashanandd'
        BACKEND_IMAGE = "${DOCKER_USER}/meetflow-backend:${BUILD_NUMBER}"
        BACKEND_LATEST = "${DOCKER_USER}/meetflow-backend:latest"
        FRONTEND_IMAGE = "${DOCKER_USER}/meetflow-frontend:${BUILD_NUMBER}"
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
                echo 'Building Docker containers for backend and frontend...'
                bat "docker build -t ${BACKEND_IMAGE} -t ${BACKEND_LATEST} ./backend"
                bat "docker build -t ${FRONTEND_IMAGE} -t ${FRONTEND_LATEST} ./frontend"
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Authenticating and pushing Docker images to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS_ID}", usernameVariable: 'DOCKER_USER_VAR', passwordVariable: 'DOCKER_PASS_VAR')]) {
                    bat '''
                        echo %DOCKER_PASS_VAR% | docker login -u %DOCKER_USER_VAR% --password-stdin
                    '''
                    bat "docker push ${BACKEND_IMAGE}"
                    bat "docker push ${BACKEND_LATEST}"
                    bat "docker push ${FRONTEND_IMAGE}"
                    bat "docker push ${FRONTEND_LATEST}"
                }
            }
        }

        stage('kubectl Apply') {
            steps {
                echo 'Applying Kubernetes manifests...'
                bat 'kubectl apply -f k8s/'
            }
        }

        stage('Rollout Status') {
            steps {
                echo 'Verifying Kubernetes Deployment Rollouts...'
                bat 'kubectl rollout status deployment/backend-deployment'
                bat 'kubectl rollout status deployment/frontend-deployment'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Performing diagnostic cluster health check...'
                bat 'kubectl get pods,svc'
            }
        }
    }

    post {
        success {
            echo 'Jenkins CI/CD Pipeline Completed Successfully! MeetFlow AI is deployed.'
        }
        failure {
            echo 'Jenkins CI/CD Pipeline Failed. Please check stage logs above.'
        }
    }
}
