pipeline {
    agent any

    environment {
        DOCKER_USER = 'yashanandd'
        BACKEND_IMAGE = "${DOCKER_USER}/meetflow-backend:${BUILD_NUMBER}"
        BACKEND_LATEST = "${DOCKER_USER}/meetflow-backend:latest"
        FRONTEND_IMAGE = "${DOCKER_USER}/meetflow-frontend:${BUILD_NUMBER}"
        FRONTEND_LATEST = "${DOCKER_USER}/meetflow-frontend:latest"
        DOCKER_CREDS_ID = 'docker-hub-credentials'
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
                    sh '''
                        python3 -m venv .venv || python -m venv .venv
                        . .venv/bin/activate || true
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
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker containers for backend and frontend...'
                sh "docker build -t ${BACKEND_IMAGE} -t ${BACKEND_LATEST} ./backend"
                sh "docker build -t ${FRONTEND_IMAGE} -t ${FRONTEND_LATEST} ./frontend"
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing Docker images to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS_ID}", usernameVariable: 'DOCKER_USER_VAR', passwordVariable: 'DOCKER_PASS_VAR')]) {
                    sh 'echo "$DOCKER_PASS_VAR" | docker login -u "$DOCKER_USER_VAR" --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${BACKEND_LATEST}"
                    sh "docker push ${FRONTEND_IMAGE}"
                    sh "docker push ${FRONTEND_LATEST}"
                }
            }
        }

        stage('kubectl Apply') {
            steps {
                echo 'Applying Kubernetes manifests...'
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Rollout Status') {
            steps {
                echo 'Verifying Kubernetes Deployment Rollouts...'
                sh 'kubectl rollout status deployment/backend-deployment'
                sh 'kubectl rollout status deployment/frontend-deployment'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Performing diagnostic cluster health check...'
                sh 'kubectl get pods,svc'
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
