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
                echo 'Building Docker containers for backend and frontend...'
                bat "docker build -t ${BACKEND_IMAGE} -t ${BACKEND_LATEST} ./backend"
                bat "docker build -t ${FRONTEND_IMAGE} -t ${FRONTEND_LATEST} ./frontend"
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Authenticating and pushing Docker images to Docker Hub...'
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
                    bat "docker push ${BACKEND_IMAGE}"
                    bat "docker push ${BACKEND_LATEST}"
                    bat "docker push ${FRONTEND_IMAGE}"
                    bat "docker push ${FRONTEND_LATEST}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests...'
                bat 'kubectl apply -f k8s/'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes deployment status...'
                bat 'kubectl get deployments'
                bat 'kubectl get pods'
                bat 'kubectl get services'
                bat 'kubectl rollout status deployment/backend-deployment'
                bat 'kubectl rollout status deployment/frontend-deployment'
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning unused Docker images...'
                bat 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully. MeetFlow AI is live!'
        }

        failure {
            echo 'Deployment failed. Rolling back Kubernetes deployment...'
            bat 'kubectl rollout undo deployment/backend-deployment'
            bat 'kubectl rollout undo deployment/frontend-deployment'
            bat 'kubectl rollout status deployment/backend-deployment'
            bat 'kubectl rollout status deployment/frontend-deployment'
            echo 'Rollback completed.'
        }

        always {
            echo 'Performing post-build cleanup...'
            bat 'docker logout'
            bat 'if exist docker_pat.txt del docker_pat.txt'
        }
    }
}
