pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPO = 'year2_se1'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        PROJECT_KEY = 'year2-se1'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Start Environment') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker compose up -d --build'
                    } else {
                        bat 'docker compose up -d --build'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker compose exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
                        sh 'docker run --rm -v "$WORKSPACE/frontend:/app" -w /app node:20-alpine sh -c "npm install --silent && npm run test:coverage"'
                    } else {
                        bat 'docker compose exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
                        bat 'docker run --rm -v "%WORKSPACE%/frontend:/app" -w /app node:20-alpine sh -c "npm install --silent && npm run test:coverage"'
                    }
                }
            }
        }

        stage('Collect Coverage') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker cp $(docker compose ps -q backend):/app/htmlcov ./htmlcov'
                    } else {
                        bat '''
                            FOR /F "tokens=*" %%i IN ('docker compose ps -q backend') DO (
                                docker cp %%i:/app/htmlcov ./htmlcov
                            )
                        '''
                    }
                }
            }
        }

        stage('Archive Coverage') {
            steps {
                archiveArtifacts artifacts: 'htmlcov/**,frontend/coverage/**', fingerprint: true
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            chmod +x scripts/run-sonar-analysis.sh
                            SONAR_TOKEN=${SONAR_TOKEN} ./scripts/run-sonar-analysis.sh
                        '''
                    } else {
                        withSonarQubeEnv('SonarQubeServer') {
                            bat '''
                                docker compose --profile analysis run --rm ^
                                    -e SONAR_HOST_URL=http://localhost:9000 ^
                                    -e SONAR_TOKEN=%SONAR_TOKEN% ^
                                    sonar-scanner
                            '''
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    if (isUnix()) {
                        echo "Waiting for SonarQube Quality Gate..."
                        sh '''
                            for i in {1..30}; do
                                QUALITY_GATE=$(curl -s -u ${SONAR_TOKEN}: http://localhost:9000/api/qualitygates/project_status?projectKey=${PROJECT_KEY} | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
                                if [ ! -z "$QUALITY_GATE" ]; then
                                    echo "Quality Gate Status: $QUALITY_GATE"
                                    if [ "$QUALITY_GATE" != "OK" ]; then
                                        echo "Quality Gate Failed!"
                                        exit 1
                                    fi
                                    break
                                fi
                                sleep 2
                            done
                        '''
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t ${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG} -t ${DOCKERHUB_REPO}:latest .'
                    } else {
                        bat 'docker build -t %DOCKERHUB_REPO%:%DOCKER_IMAGE_TAG% -t %DOCKERHUB_REPO%:latest .'
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                            docker push ${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}
                            docker push ${DOCKERHUB_REPO}:latest
                            docker logout
                        '''
                    } else {
                        bat '''
                            echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin
                            docker push %DOCKERHUB_REPO%:%DOCKER_IMAGE_TAG%
                            docker push %DOCKERHUB_REPO%:latest
                            docker logout
                        '''
                    }
                }
            }
        }

    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker compose down -v'
                } else {
                    bat 'docker compose down -v'
                }
            }
        }
        success {
            echo "Pipeline completed successfully!"
            echo "Docker image pushed: ${DOCKERHUB_REPO}:${DOCKER_IMAGE_TAG}"
            echo "SonarQube report: http://localhost:9000/dashboard?id=${PROJECT_KEY}"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}